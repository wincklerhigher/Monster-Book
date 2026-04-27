import { useState, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './FilterBar.css';

const FilterBar = ({ onFilterChange }) => {
  const [cr, setCr] = useState('');
  const [type, setType] = useState('');
  const [size, setSize] = useState('');
  const { t } = useLanguage();

  const handleReset = useCallback(() => {
    setCr('');
    setType('');
    setSize('');
    onFilterChange({ cr: '', type: '', size: '' });
  }, [onFilterChange]);

  const toggleFilter = (setter, currentValue, newValue, filterName) => {
    const finalValue = currentValue === newValue ? '' : newValue;
    setter(finalValue);
    // Build a minimal filter object to send upwards. Keep other keys present.
    onFilterChange({ cr, type, size, [filterName]: finalValue });
  };

  const hasActiveFilters = Boolean(cr || type || size);

  return (
    <div className="filter-bar">
      <div className="filter-container">
        <div className="filter-chips">
          {/* Size Filter */}
          <div className="filter-chip-group">
            <label className="filter-label">Tamanho</label>
            <div className="chip-container">
              <button
                className={`chip ${size === 'Pequeno' ? 'chip--active' : ''}`}
                onClick={() => toggleFilter(setSize, size, 'Pequeno', 'size')}
              >
                <span className="chip-icon">🔍</span>
                Pequeno
              </button>
              <button
                className={`chip ${size === 'Médio' ? 'chip--active' : ''}`}
                onClick={() => toggleFilter(setSize, size, 'Médio', 'size')}
              >
                <span className="chip-icon">🔍</span>
                Médio
              </button>
              <button
                className={`chip ${size === 'Grande' ? 'chip--active' : ''}`}
                onClick={() => toggleFilter(setSize, size, 'Grande', 'size')}
              >
                <span className="chip-icon">🔍</span>
                Grande
              </button>
            </div>
          </div>

          {/* Type Filter */}
          <div className="filter-chip-group">
            <label className="filter-label">Tipo</label>
            <div className="chip-container">
              <button
                className={`chip ${type === 'Dragão' ? 'chip--active' : ''}`}
                onClick={() => toggleFilter(setType, type, 'Dragão', 'type')}
              >
                <span className="chip-icon">🐉</span>
                Dragão
              </button>
              <button
                className={`chip ${type === 'Morto-vivo' ? 'chip--active' : ''}`}
                onClick={() => toggleFilter(setType, type, 'Morto-vivo', 'type')}
              >
                <span className="chip-icon">💀</span>
                Morto-vivo
              </button>
              <button
                className={`chip ${type === 'Besta' ? 'chip--active' : ''}`}
                onClick={() => toggleFilter(setType, type, 'Besta', 'type')}
              >
                <span className="chip-icon">🦁</span>
                Besta
              </button>
              <button
                className={`chip ${type === 'Humanoide' ? 'chip--active' : ''}`}
                onClick={() => toggleFilter(setType, type, 'Humanoide', 'type')}
              >
                <span className="chip-icon">👤</span>
                Humanoide
              </button>
            </div>
          </div>

          {/* CR Filter */}
          <div className="filter-chip-group">
            <label className="filter-label">Nível de CR</label>
            <div className="chip-container">
              <button
                className={`chip ${cr === '1/4' ? 'chip--active' : ''}`}
                onClick={() => toggleFilter(setCr, cr, '1/4', 'cr')}
              >
                <span className="chip-icon">⭐</span>
                Fácil (1/4)
              </button>
              <button
                className={`chip ${cr === '5' ? 'chip--active' : ''}`}
                onClick={() => toggleFilter(setCr, cr, '5', 'cr')}
              >
                <span className="chip-icon">⚔️</span>
                Médio (5)
              </button>
              <button
                className={`chip ${cr === '15' ? 'chip--active' : ''}`}
                onClick={() => toggleFilter(setCr, cr, '15', 'cr')}
              >
                <span className="chip-icon">👑</span>
                Difícil (15)
              </button>
            </div>
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <button onClick={handleReset} className="filter-reset">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18m-9-9v18" />
              </svg>
              Limpar Filtros
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
