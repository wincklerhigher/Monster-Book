import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/Language-Context';
import { useDebounce } from '../hooks/useDebounce';
import './SearchBar.css';

const SearchBar = ({ onSearch, resetKey }) => {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('search') || '';
  // Initialize from URL, but also respond to resetKey changes
  const [query, setQuery] = useState(queryParam);
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const { t } = useLanguage();

  // Sync with URL - clear when no search param or when resetKey changes
  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam, resetKey]);

  // Call onSearch when debounced query changes, not on every keystroke
  useEffect(() => {
    if (debouncedQuery !== '') {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className={`search-bar ${isFocused ? 'search-bar--focused' : ''}`}>
      <div className="search-container">
        <div className="search-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="search-input"
          />
        </form>
        <button 
          type="submit" 
          className="search-button"
          onClick={handleSubmit}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <span className="button-text">{t('searchButton')}</span>
        </button>
      </div>
      <div className="search-glow"></div>
    </div>
  );
};

export default SearchBar;