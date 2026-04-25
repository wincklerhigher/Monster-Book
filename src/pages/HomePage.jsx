import React, { useState, useEffect, useCallback } from 'react';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import MonsterCard from '../components/MonsterCard';
import Pagination from '../components/Pagination';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { fetchMonsters, normalizeMonster } from '../services/open5eApi';
import { mergeAllWithOverrides } from '../services/overrides';
import '../styles/HomePage.css';

const ITEMS_PER_PAGE = 24;

const HomePage = () => {
  const [monsters, setMonsters] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ cr: '', type: '', size: '' });
  const [hasMore, setHasMore] = useState(true);

  const loadMonsters = useCallback(async (page) => {
    try {
      setLoading(true);
      setError(null);
      
      const { monsters: fetchedMonsters, count, next } = await fetchMonsters({ 
        page, 
        search: searchQuery, 
        cr: filters.cr 
      });
      
      const normalized = fetchedMonsters.map(normalizeMonster);
      const deduplicated = deduplicateMonsters(normalized);
      const withOverrides = mergeAllWithOverrides(deduplicated);
      setMonsters(withOverrides);
      setTotalCount(count);
      setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
      setHasMore(!!next);
    } catch (err) {
      setError('Falha ao carregar monstros. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters.cr, filters.type]);

  useEffect(() => {
    setCurrentPage(1);
    loadMonsters(1);
  }, [searchQuery, filters.cr, filters.type]);

  useEffect(() => {
    if (currentPage > 1) {
      loadMonsters(currentPage);
    }
  }, [currentPage]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const parseCR = (cr) => {
    if (!cr || cr === 'Unknown') return 0;
    if (cr.includes('/')) {
      const [num, den] = cr.split('/').map(Number);
      return num / den;
    }
    return parseFloat(cr) || 0;
  };

  const normalizeName = (name) => {
    return name
      .toLowerCase()
      .replace(/\s*(wyrmling|young|elder|progenitor|adult|ancient|veteran|master|lesser|greater|half|half-\w+|pawn|brood|spawn)\s*/gi, ' ')
      .replace(/\s*\(.*?\)\s*/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const getBaseName = (name) => {
    const normalized = normalizeName(name);
    const parts = normalized.split(' ');
    return parts[0];
  };

  const deduplicateMonsters = (monsters) => {
    const seen = new Map();
    return monsters.filter(monster => {
      const baseName = getBaseName(monster.name);
      if (!seen.has(baseName)) {
        seen.set(baseName, monster);
        return true;
      }
      const existing = seen.get(baseName);
      const existingCR = parseCR(existing.challenge_rating);
      const newCR = parseCR(monster.challenge_rating);
      if (newCR > existingCR) {
        seen.set(baseName, monster);
        return true;
      }
      return false;
    });
  };

  const sortedMonsters = [...monsters].sort((a, b) => {
    if (filters.size) {
      const sizeMatch = a.size.toLowerCase().includes(filters.size.toLowerCase());
      if (!sizeMatch) return 1;
    }
    if (sortBy === 'cr') {
      return parseCR(a.challenge_rating) - parseCR(b.challenge_rating);
    }
    return a.name.localeCompare(b.name);
  }).filter(m => {
    if (filters.size && !m.size.toLowerCase().includes(filters.size.toLowerCase())) {
      return false;
    }
    if (filters.type && !m.type.toLowerCase().includes(filters.type.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading && monsters.length === 0) return <LoadingSkeleton />;

  return (
    <>
      <Hero />
      <SearchBar onSearch={handleSearch} />
      <FilterBar onFilterChange={handleFilterChange} />
      
      <div className="results-header">
        <p className="results-count">
          {totalCount > 0 ? `${totalCount.toLocaleString()} monstros` : 'Carregando...'}
        </p>
        <select 
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Ordenar por Nome</option>
          <option value="cr">Ordenar por CR</option>
        </select>
      </div>

      {error && <div className="error-container"><p className="error">{error}</p></div>}

      <div className="monster-grid">
        {loading ? (
          <LoadingSkeleton />
        ) : sortedMonsters.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum monstro encontrado com os critérios atuais.</p>
            <p className="empty-hint">Tente ajustar os filtros ou buscar outro termo.</p>
          </div>
        ) : (
          sortedMonsters.map(monster => (
            <MonsterCard key={monster.id} monster={monster} />
          ))
        )}
      </div>

      {!loading && totalPages > 1 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      )}
    </>
  );
};

export default HomePage;