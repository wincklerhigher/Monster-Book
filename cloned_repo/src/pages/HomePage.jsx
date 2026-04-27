import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import MonsterCard from '../components/MonsterCard';
import Pagination from '../components/Pagination';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { useDebounce } from '../hooks/useDebounce';
import { useMonsterStore } from '../context/MonsterStoreContext';
import { fetchMonsters, normalizeMonster } from '../services/open5eApi';
import { mergeAllWithOverrides } from '../services/overrides';
import { enrichMonsterWithScenario } from '../services/scenarioService';
import { normalizeFilterValue } from '../services/filterMapper';
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

const getBaseName = (name) => normalizeName(name).split(' ')[0];

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

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { t } = useLanguage();

  const {
    monsters: storeMonsters,
    setMonsters: setStoreMonsters,
    setPage: setStorePage,
    setTotalPages: setStoreTotalPages,
  } = useMonsterStore();

  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const queryParam = searchParams.get('search') || '';
  const crParam = searchParams.get('cr') || '';
  const typeParam = searchParams.get('type') || '';
  const sizeParam = searchParams.get('size') || '';
  const regionParam = searchParams.get('region') || '';
  const environmentParam = searchParams.get('environment') || '';

  const [monsters, setMonsters] = useState(storeMonsters.length ? storeMonsters : []);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [filters, setFilters] = useState({
    cr: crParam,
    type: typeParam,
    size: sizeParam,
    region: regionParam,
    environment: environmentParam,
  });

  const [extraPages, setExtraPages] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  const notFoundList = useMemo(() => getNotFoundList(), []);

  const isBackNav = useRef(false);
  const isInitialMount = useRef(true);

  // 🔥 Detecta navegação (back/forward)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    isBackNav.current = true;

    const timer = setTimeout(() => {
      isBackNav.current = false;
    }, 50);

    return () => clearTimeout(timer);
  }, [location.key]);

  // 🔥 URL → STATE (quando volta)
  useEffect(() => {
    if (!isBackNav.current) return;

    setSearchQuery(queryParam);
    setFilters({
      cr: crParam,
      type: typeParam,
      size: sizeParam,
      region: regionParam,
      environment: environmentParam,
    });
    setCurrentPage(pageParam);
  }, [location.key]);

  // 🔥 STATE → URL (uso normal)
  useEffect(() => {
    if (isBackNav.current) return;

    const params = new URLSearchParams();

    if (searchQuery) params.set('search', searchQuery);
    if (filters.cr) params.set('cr', filters.cr);
    if (filters.type) params.set('type', filters.type);
    if (filters.size) params.set('size', filters.size);
    if (filters.region) params.set('region', filters.region);
    if (filters.environment) params.set('environment', filters.environment);
    if (currentPage !== 1) params.set('page', String(currentPage));

    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [searchQuery, filters, currentPage]);

  // 🔥 FETCH
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { monsters: fetchedMonsters, count } = await fetchMonsters({
          page: currentPage,
          search: searchQuery,
          cr: filters.cr,
        });

        const normalized = fetchedMonsters.map(normalizeMonster);
        const deduped = deduplicateMonsters(normalized);
        const withOverrides = mergeAllWithOverrides(deduped);
        const withScenario = withOverrides.map(enrichMonsterWithScenario);

        if (cancelled) return;

        setMonsters(withScenario);
        setStoreMonsters(withScenario);
        setStorePage(currentPage);

        const pages = Math.min(Math.ceil(count / ITEMS_PER_PAGE), 65);
        setTotalPages(pages);
        setStoreTotalPages(pages);

      } catch (e) {
        setError('Falha ao carregar monstros.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [currentPage, searchQuery, filters.cr]);

  const sortedMonsters = useMemo(() => {
    return [...monsters]
      .sort((a, b) =>
        sortBy === 'cr'
          ? parseCR(a.challenge_rating) - parseCR(b.challenge_rating)
          : a.name.localeCompare(b.name)
      )
      .filter((m) => !notFoundList.includes(m.id));
  }, [monsters, sortBy, notFoundList]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters({
      cr: '',
      type: '',
      size: '',
      region: '',
      environment: '',
      ...(newFilters || {}),
    });
    setCurrentPage(1);
  }, []);

  const debouncedHandleFilterChange = useDebounce(handleFilterChange, 300);

  const handleClearAll = () => {
    setSearchQuery('');
    setFilters({ cr: '', type: '', size: '', region: '', environment: '' });
    setCurrentPage(1);
    setResetKey((k) => k + 1);
  };

  return (
    <>
      <Hero />

      <SearchBar onSearch={handleSearch} resetKey={resetKey} />
      <FilterBar onFilterChange={debouncedHandleFilterChange} />

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="monsters-grid">
          {sortedMonsters.map((m) => (
            <MonsterCard
  key={m.id}
  monster={m}
/>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <Footer />
    </>
  );
};

export default HomePage;