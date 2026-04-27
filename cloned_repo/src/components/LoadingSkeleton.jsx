import './LoadingSkeleton.css';

const LoadingSkeleton = () => {
  return (
    <>
      <div className="hero-skeleton">
        <div className="skeleton-title"></div>
        <div className="skeleton-subtitle"></div>
      </div>
      <div className="search-skeleton"></div>
      <div className="filters-skeleton"></div>
      <div className="monster-grid-skeleton">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="card-skeleton">
            <div className="card-image-skeleton"></div>
            <div className="card-content-skeleton">
              <div className="card-title-skeleton"></div>
              <div className="card-badges-skeleton">
                <div className="badge-skeleton"></div>
                <div className="badge-skeleton"></div>
                <div className="badge-skeleton"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default LoadingSkeleton;