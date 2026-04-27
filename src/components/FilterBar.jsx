import { useState, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './FilterBar.css';

const FilterBar = ({ onFilterChange }) => {
  const [cr, setCr] = useState('');
  const [type, setType] = useState('');
  const [size, setSize] = useState('');
  const { t } = useLanguage();

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'cr') setCr(value);
    else if (name === 'type') setType(value);
    else if (name === 'size') setSize(value);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onFilterChange({ cr, type, size });
  }, [cr, type, size, onFilterChange]);

  const handleReset = useCallback(() => {
    setCr('');
    setType('');
    setSize('');
    onFilterChange({ cr: '', type: '', size: '' });
  }, [onFilterChange]);

  const hasActiveFilters = cr || type || size;

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
                onClick={() => {
                  setSize(size === 'Pequeno' ? '' : 'Pequeno');
                  onFilterChange({ cr, type, size: size === 'Pequeno' ? '' : 'Pequeno' });
                }}
              >
                <span className="chip-icon">🔍</span>
                Pequeno
              </button>
              <button
                className={`chip ${size === 'Médio' ? 'chip--active' : ''}`}
                onClick={() => {
                  setSize(size === 'Médio' ? '' : 'Médio');
                  onFilterChange({ cr, type, size: size === 'Médio' ? '' : 'Médio' });
                }}
              >
                <span className="chip-icon">🔍</span>
                Médio
              </button>
              <button
                className={`chip ${size === 'Grande' ? 'chip--active' : ''}`}
                onClick={() => {
                  setSize(size === 'Grande' ? '' : 'Grande');
                  onFilterChange({ cr, type, size: size === 'Grande' ? '' : 'Grande' });
                }}
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
                onClick={() => {
                  setType(type === 'Dragão' ? '' : 'Dragão');
                  onFilterChange({ cr, type: type === 'Dragão' ? '' : 'Dragão', size });
                }}
              >
                <span className="chip-icon">🐉</span>
                Dragão
              </button>
              <button
                className={`chip ${type === 'Morto-vivo' ? 'chip--active' : ''}`}
                onClick={() => {
                  setType(type === 'Morto-vivo' ? '' : 'Morto-vivo');
                  onFilterChange({ cr, type: type === 'Morto-vivo' ? '' : 'Morto-vivo', size });
                }}
              >
                <span className="chip-icon">💀</span>
                Morto-vivo
              </button>
              <button
                className={`chip ${type === 'Besta' ? 'chip--active' : ''}`}
                onClick={() => {
                  setType(type === 'Besta' ? '' : 'Besta');
                  onFilterChange({ cr, type: type === 'Besta' ? '' : 'Besta', size });
                }}
              >
                <span className="chip-icon">🦁</span>
                Besta
              </button>
              <button
                className={`chip ${type === 'Humanoide' ? 'chip--active' : ''}`}
                onClick={() => {
                  setType(type === 'Humanoide' ? '' : 'Humanoide');
                  onFilterChange({ cr, type: type === 'Humanoide' ? '' : 'Humanoide', size });
                }}
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
                onClick={() => {
                  setCr(cr === '1/4' ? '' : '1/4');
                  onFilterChange({ cr: cr === '1/4' ? '' : '1/4', type, size });
                }}
              >
                <span className="chip-icon">⭐</span>
                Fácil (1/4)
              </button>
              <button
                className={`chip ${cr === '5' ? 'chip--active' : ''}`}
                onClick={() => {
                  setCr(cr === '5' ? '' : '5');
                  onFilterChange({ cr: cr === '5' ? '' : '5', type, size });
                }}
              >
                <span className="chip-icon">⚔️</span>
                Médio (5)
              </button>
              <button
                className={`chip ${cr === '15' ? 'chip--active' : ''}`}
                onClick={() => {
                  setCr(cr === '15' ? '' : '15');
                  onFilterChange({ cr: cr === '15' ? '' : '15', type, size });
                }}
              >
                <span className="chip-icon">👑</span>
                Difícil (15)
              </button>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button 
            onClick={handleReset}
            className="filter-reset"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18m-9-9v18"/>
            </svg>
            Limpar Filtros
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;