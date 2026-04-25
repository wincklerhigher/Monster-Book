import { useLanguage } from '../context/LanguageContext';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useLanguage();
  
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    
    const left = Math.max(2, currentPage - 1);
    const right = Math.min(totalPages - 1, currentPage + 1);
    
    pages.push(1);
    
    if (currentPage > 3) pages.push('ellipsis-start');
    
    for (let i = left; i <= right; i++) {
      if (!pages.includes(i)) pages.push(i);
    }
    
    if (currentPage < totalPages - 2) pages.push('ellipsis-end');
    
    if (!pages.includes(totalPages)) pages.push(totalPages);
    
    return pages.sort((a, b) => (typeof a === 'number' ? a : 0) - (typeof b === 'number' ? b : 0));
  };

  const pages = getVisiblePages();

  return (
    <div className="pagination">
      <button
        className="page-btn nav-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        title={t('previous')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <div className="pages-container">
        {pages.map((page) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return <span key={page} className="ellipsis">•••</span>;
          }
          return (
            <button
              key={page}
              className={`page-btn ${page === currentPage ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        className="page-btn nav-btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        title={t('next')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default Pagination;