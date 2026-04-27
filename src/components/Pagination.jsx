import { useLanguage } from '../context/LanguageContext';
import './Pagination.css';
import { useState, useEffect } from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useLanguage();
  const [goTo, setGoTo] = useState(String(currentPage));

  useEffect(() => setGoTo(String(currentPage)), [currentPage]);

  if (totalPages <= 1) return null;

  const handleInput = e => {
    if (/^\d*$/.test(e.target.value)) setGoTo(e.target.value);
  };

  const applyGo = () => {
    const page = parseInt(goTo, 10);
    if (isNaN(page)) return;
    const pageClamped = Math.max(1, Math.min(page, totalPages));
    if (pageClamped !== currentPage) onPageChange(pageClamped);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') applyGo();
  };

  return (
    <nav className="pagination">
      <button
        className="pagination-btn prev-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        title={t('previous')}
      >
        {t('previous')}
      </button>

      <div className="pagination-center">
        <span className="page-label">
          Página {currentPage} de {totalPages}
        </span>
        <div className="jump-group">
          <input
            type="number"
            min="1"
            max={totalPages}
            value={goTo}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
          />
          <button
            className="go-btn"
            onClick={applyGo}
            disabled={parseInt(goTo, 10) === currentPage}
          >
            Ir
          </button>
        </div>
      </div>

      <button
        className="pagination-btn next-btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        title={t('next')}
      >
        {t('next')}
      </button>
    </nav>
  );
};

export default Pagination;