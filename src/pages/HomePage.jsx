import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import MonsterCard from '../components/MonsterCard';
import Pagination from '../components/Pagination';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { fetchMonsters, normalizeMonster } from '../services/open5eApi';
import { mergeAllWithOverrides } from '../services/overrides';
import { getNotFoundList } from '../services/notFoundStore';
import '../styles/HomePage.css';

const ITEMS_PER_PAGE = 24;

const parseCR = (cr) => {
  if (!cr || cr === 'Unknown') return 0;
  if (cr.includes('/')) {
    const [num, den] = cr.split('/').map(Number);
    return num / den;
  }
  return parseFloat(cr) || 0;
};

const normalizeName = (name) =>
  name
    .toLowerCase()
    .replace(/\s*(wyrmling|young|elder|progenitor|adult|ancient|veteran|master|lesser|greater|half|half-\w+|pawn|brood|spawn)\s*/gi, ' ')
    .replace(/\s*\(.*?\)\s*/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const deduplicateMonsters = (monsters) => {
  const seen = new Map();
  return monsters.filter((monster) => {
    const baseName = getBaseName(monster.name);
    if (!seen.has(baseName)) {
      seen.set(baseName, monster);
      return true;
    }
    const existing = seen.get(baseName);
    if (parseCR(monster.challenge_rating) > parseCR(existing.challenge_rating)) {
      seen.set(baseName, monster);
      return true;
    }
    return false;
  });
};

const getBaseName = (name) => {
  const normalized = normalizeName(name);
  return normalized.split(' ')[0];
};

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const queryParam = searchParams.get('search') || '';
  const crParam = searchParams.get('cr') || '';
  const typeParam = searchParams.get('type') || '';
  const sizeParam = searchParams.get('size') || '';

  const [monsters, setMonsters] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [filters, setFilters] = useState({ cr: crParam, type: typeParam, size: sizeParam });
  const notFoundList = useState(() => getNotFoundList())[0];

  // load data whenever page, search or filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const { monsters: fetchedMonsters, count } = await fetchMonsters({
          page: currentPage,
          search: searchQuery,
          cr: filters.cr,
          type: filters.type,
          size: filters.size,
        });
        const normalized = fetchedMonsters.map(normalizeMonster);
        const deduped = deduplicateMonsters(normalized);
        setMonsters(mergeAllWithOverrides(deduped));
        setTotalCount(count);
        let calculatedPages = Math.ceil(count / ITEMS_PER_PAGE);
        // USA APENAS at 65 como máximo, independente do que a API retornar
        if (calculatedPages > 65) {
          calculatedPages = 65;
        }
        setTotalPages(calculatedPages);
        if (currentPage > calculatedPages) {
          setCurrentPage(calculatedPages);
        }
      } catch (e) {
        console.error('Fetch error:', e, 'Filters:', filters);
        if (e.message.includes('404')) {
          const lastPage = Math.max(1, currentPage - 1);
          setCurrentPage(lastPage);
          setTotalPages(lastPage);
        } else {
          setError('Falha ao carregar monstros. Tente novamente.');
        }
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, searchQuery, filters]);

  // keep URL in sync when state changes (search, filters, page)
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (filters.cr) params.set('cr', filters.cr);
    if (filters.type) params.set('type', filters.type);
    if (filters.size) params.set('size', filters.size);
    if (currentPage !== 1) params.set('page', String(currentPage));
    setSearchParams(params);
  }, [searchQuery, filters, currentPage]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const sortedMonsters = useMemo(() => {
    return [...monsters]
      .sort((a, b) => {
        if (filters.size) {
          if (!a.size.toLowerCase().includes(filters.size.toLowerCase())) return 1;
        }
        if (sortBy === 'cr') return parseCR(a.challenge_rating) - parseCR(b.challenge_rating);
        return a.name.localeCompare(b.name);
      })
      .filter((m) => {
        if (notFoundList.includes(m.id)) return false;
        if (filters.size && !m.size.toLowerCase().includes(filters.size.toLowerCase())) return false;
        if (filters.type && !m.type.toLowerCase().includes(filters.type.toLowerCase())) return false;
        return true;
      });
  }, [monsters, sortBy, filters, notFoundList]);

  if (loading && monsters.length === 0) return <LoadingSkeleton />;

  return (
    <>
      <Hero />
      <SearchBar onSearch={handleSearch} />
      <FilterBar onFilterChange={handleFilterChange} />
      <div className="results-header">
        <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">{t('sortByName')}</option>
          <option value="cr">{t('sortByCr')}</option>
        </select>
      </div>
      {error && <div className="error-container"><p className="error">{error}</p></div>}
      <div className="monster-grid">
        {sortedMonsters.length === 0 ? (
          <div className="empty-state">
            <p>{t('noMonsters')}</p>
            <p className="empty-hint">{t('tryAdjust')}</p>
          </div>
        ) : (
          sortedMonsters.map((m) => <MonsterCard key={m.id} monster={m} />)
        )}
      </div>
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
      <Footer />
    </>
  );
};

export default HomePage;
