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
import { enrichMonsterWithScenario } from '../services/scenarioService';
import { normalizeFilterValue, normalizeFilterForComparison } from '../services/filterMapper';
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
  const regionParam = searchParams.get('region') || '';
  const environmentParam = searchParams.get('environment') || '';

  const [monsters, setMonsters] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
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
    environment: environmentParam
  });
  const notFoundList = useState(() => getNotFoundList())[0];
  const [extraPages, setExtraPages] = useState(0);
  
  // Sync state with URL params - clear if not in URL
  const [resetKey, setResetKey] = useState(0);
  
  // Sync state with URL params - SOMENTE ATUALIZA SE VALORES REALMENTE MUDARAM
  useEffect(() => {
    // Apenas sincroniza estado, NÃO reseta página nem limpa monstros
    setSearchQuery(queryParam);
    setFilters({
      cr: crParam,
      type: typeParam,
      size: sizeParam,
      region: regionParam,
      environment: environmentParam
    });
    
    // Sincroniza página da URL sem resetar para 1
    if (pageParam && pageParam !== currentPage) {
      setCurrentPage(pageParam);
    }
  }, [queryParam, crParam, typeParam, sizeParam, regionParam, environmentParam, pageParam]);
  
  // clear search when region filter is used
  useEffect(() => {
    if (filters.region && searchQuery) {
      setSearchQuery('');
    }
  }, [filters.region]);
  
  // load data whenever page, search or filters change
  useEffect(() => {
    let cancelled = false;
    const timeoutId = setTimeout(() => {
      if (!cancelled) {
        setLoading(false);
        setError('Tempo limite excedido. Tente novamente.');
      }
    }, 10000);

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const hasLocalFilters = filters.size || filters.type || filters.region;
        
        // If region or environment filter, search for related terms
        if (hasLocalFilters) {
          const regionSearch = {
            'north': 'frost giant orc wolf yeti mammoth',
            'sword-coast': 'dwarf humanoid',
            'underdark': 'drow aboleth'
          };
          const envSearch = {
            'underdark': 'drow',
            'forest': 'wolf',
            'swamp': 'crocodile',
            'mountain': 'giant',
            'desert': 'scorpion',
            'cave': 'troll'
};
          
          // When filter is active, use filter's search term
          let searchTerm = searchQuery;
          if (!searchTerm && filters.region) {
            searchTerm = regionSearch[filters.region];
          }
          
          // Also use type as search term if set
          if (!searchTerm && filters.type) {
            const typeSearch = {
              'Dragão': 'dragon',
              'Morto-vivo': 'undead',
              'Besta': 'beast',
              'Humanoide': 'humanoid',
              'Monstro': 'monstrosity',
              'Elemental': 'elemental',
              'Aberração': 'aberration',
              'Fey': 'fey',
              'Gigante': 'giant'
            };
            searchTerm = typeSearch[filters.type] || filters.type;
          }
          
          console.log('Filters:', filters, 'SearchTerm:', searchTerm || '(none)');
          
          let allMonsters = [];
          let totalCount = 0;
          
          // Load more pages when filter is active
          const pagesToFetch = filters.region ? 3 : 1;
          
          for (let page = 1; page <= pagesToFetch; page++) {
            try {
              console.log('Fetching page', page, 'search:', searchTerm);
              const { monsters: fetchedMonsters, count } = await fetchMonsters({
                page,
                search: searchTerm,
                cr: filters.cr
              });
              
              console.log('Page', page, 'got', fetchedMonsters.length, 'monsters');
              
              if (fetchedMonsters.length === 0) {
                console.log('No more results, stopping');
                break;
              }
              const normalized = fetchedMonsters.map(normalizeMonster);
              const deduped = deduplicateMonsters(normalized);
allMonsters = [...allMonsters, ...deduped];
              totalCount = count;
            } catch (err) {
              console.log('Page error:', page, err.message);
              break;
            }
          }
          
          if (cancelled) return;
          
          const withOverrides = mergeAllWithOverrides(allMonsters);
          const withScenario = withOverrides.map(enrichMonsterWithScenario);
          console.log('Loaded:', withScenario.length);
          
          setMonsters(withScenario);
          setTotalCount(totalCount);
          setExtraPages(0);
        } else {
          // Sem filtros locais - comportamento normal paginado
          const { monsters: fetchedMonsters, count } = await fetchMonsters({
            page: currentPage,
            search: searchQuery,
            cr: filters.cr,
          });
          
          const normalized = fetchedMonsters.map(normalizeMonster);
          const deduped = deduplicateMonsters(normalized);
          const withOverrides = mergeAllWithOverrides(deduped);
          const withScenario = withOverrides.map(enrichMonsterWithScenario);
          setMonsters(withScenario);
          setTotalCount(count);
          
          let calculatedPages = Math.ceil(count / ITEMS_PER_PAGE);
          if (calculatedPages > 65) {
            calculatedPages = 65;
          }
          setTotalPages(calculatedPages);
          if (currentPage > calculatedPages) {
            setCurrentPage(calculatedPages);
          }
        }
        
        setLoading(false);
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
      }
      
      if (!cancelled) {
        setLoading(false);
        clearTimeout(timeoutId);
      }
    };
    
    fetchData();
    
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
}, [currentPage, searchQuery, filters]);
  
  const sortedMonsters = useMemo(() => {
    const filtered = [...monsters]
      .sort((a, b) => {
        if (sortBy === 'cr') return parseCR(a.challenge_rating) - parseCR(b.challenge_rating);
        return a.name.localeCompare(b.name);
      })
      .filter((m) => {
        if (notFoundList.includes(m.id)) return false;
        
        // Size filter
        if (filters.size) {
          const apiSize = normalizeFilterValue('size', filters.size);
          const monsterSizeLower = m.size?.toLowerCase() || '';
          if (!monsterSizeLower.includes(apiSize?.toLowerCase())) return false;
        }
        
        // Type filter  
        if (filters.type) {
          const apiType = normalizeFilterValue('type', filters.type);
          const monsterTypeLower = m.type?.toLowerCase() || '';
          if (!monsterTypeLower.includes(apiType?.toLowerCase())) return false;
        }
        
        // Region filter
        if (filters.region) {
          if (!m.region || m.region !== filters.region) return false;
        }
        
// Environment filter - disabled (API limits)
        // if (filters.environment) {
        //   if (!m.environment || m.environment !== filters.environment) return false;
        // }
        
        // Region filter - exact match
        if (filters.region) {
          if (!m.region || m.region !== filters.region) return false;
        }
        
        return true;
      });
    
    return filtered;
  }, [monsters, sortBy, filters, notFoundList]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setExtraPages(0);
  };

  const handleClearAll = () => {
    // Clear all filters and search query
    setSearchQuery('');
    setFilters({ cr: '', type: '', size: '', region: '', environment: '' });
    // Remove all URL query parameters
    setSearchParams({});
    // Reset the search bar component state
    setResetKey((k) => k + 1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Atualiza URL com o número da página
      setSearchParams(prev => {
        const params = new URLSearchParams(prev);
        params.set('page', page.toString());
        return params;
      });
    }
  };

  const handleLoadMore = async () => {
    try {
      setLoading(true);
      const nextPage = extraPages + 2;
      
      const { monsters: fetchedMonsters } = await fetchMonsters({
        page: nextPage,
        search: searchQuery,
        cr: filters.cr
      });
      
      const normalized = fetchedMonsters.map(normalizeMonster);
      const deduped = deduplicateMonsters(normalized);
      const withOverrides = mergeAllWithOverrides(deduped);
      const withScenario = withOverrides.map(enrichMonsterWithScenario);
      
      setMonsters(prev => [...prev, ...withScenario]);
      setExtraPages(nextPage);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };
  
  const shouldShowClearAll = searchQuery || filters.cr || filters.type || filters.size || filters.region;
  
  return (
    <>
      <Hero />
      {shouldShowClearAll && (
        <div className="clear-all-container">
          <button className="clear-all-btn" onClick={() => handleClearAll()}>
            ✕ Clear All Filters
          </button>
        </div>
      )}
      <SearchBar onSearch={handleSearch} resetKey={resetKey} />
      <FilterBar onFilterChange={handleFilterChange} />
      <div className="results-header">
        <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">{t('sortByName')}</option>
          <option value="cr">{t('sortByCr')}</option>
        </select>
      </div>
      {error && <div className="error-container"><p className="error">{error}</p></div>}
      <div className="monster-grid">
        {loading ? (
          <LoadingSkeleton />
        ) : sortedMonsters.length === 0 ? (
          <div className="empty-state">
            <p>{t('noMonsters')}</p>
            <p className="empty-hint">{t('tryAdjust')}</p>
          </div>
        ) : (
          sortedMonsters.map((m) => <MonsterCard key={m.id} monster={m} currentPage={currentPage} />)
        )}
      </div>
      {(filters.size || filters.type || filters.region) && sortedMonsters.length > 0 && (
        <button className="load-more-btn" onClick={handleLoadMore} disabled={loading}>
          {loading ? t('loading') : 'Carregar mais'}
        </button>
      )}
      {totalPages > 1 && !loading && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
      <Footer />
    </>
  );
};

export default HomePage;
