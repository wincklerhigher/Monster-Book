import { useState } from 'react';
import './FilterBar.css';

const FilterBar = ({ onFilterChange }) => {
  const [cr, setCr] = useState('');
  const [type, setType] = useState('');
  const [size, setSize] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cr') setCr(value);
    else if (name === 'type') setType(value);
    else if (name === 'size') setSize(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ cr, type, size });
  };

  const handleReset = () => {
    setCr('');
    setType('');
    setSize('');
    onFilterChange({ cr: '', type: '', size: '' });
  };

  return (
    <div className="filter-bar">
      <form onSubmit={handleSubmit} className="filter-form">
        <div className="filter-group">
          <label htmlFor="cr">Challenge Rating</label>
          <input
            type="text"
            id="cr"
            name="cr"
            placeholder="ex: 1/4, 1, 5"
            value={cr}
            onChange={handleChange}
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <label htmlFor="type">Tipo</label>
          <input
            type="text"
            id="type"
            name="type"
            placeholder="ex: dragon, beast"
            value={type}
            onChange={handleChange}
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <label htmlFor="size">Tamanho</label>
          <input
            type="text"
            id="size"
            name="size"
            placeholder="ex: Medium, Large"
            value={size}
            onChange={handleChange}
            className="filter-input"
          />
        </div>
        <button type="submit" className="filter-button">
          Filtrar
        </button>
        <button type="button" onClick={handleReset} className="filter-button reset">
          Limpar
        </button>
      </form>
    </div>
  );
};

export default FilterBar;