import { useState, memo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './MonsterCard.css';

const typeData = {
  dragão: {
    icon: '🐉',
    gradient: 'linear-gradient(135deg, #6b1a1a 0%, #8b2525 50%, #a52a2a 100%)',
    badge: 'dragão'
  },
  'morto-vivo': {
    icon: '💀',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #4a0e4a 50%, #6b1a1a 100%)',
    badge: 'morto-vivo'
  },
  besta: {
    icon: '🦁',
    gradient: 'linear-gradient(135deg, #4a5016 0%, #654321 50%, #2d5016 100%)',
    badge: 'besta'
  },
  elemento: {
    icon: '🔥',
    gradient: 'linear-gradient(135deg, #cc3700 0%, #ff4500 50%, #b8860b 100%)',
    badge: 'elemento'
  },
  demônio: {
    icon: '😈',
    gradient: 'linear-gradient(135deg, #4a0000 0%, #6b0000 50%, #8b0000 100%)',
    badge: 'demônio'
  },
  humanoide: {
    icon: '👤',
    gradient: 'linear-gradient(135deg, #191970 0%, #4169e1 50%, #4682b4 100%)',
    badge: 'humanoide'
  },
  gigante: {
    icon: '👺',
    gradient: 'linear-gradient(135deg, #696969 0%, #8b7355 50%, #daa520 100%)',
    badge: 'gigante'
  },
  aberração: {
    icon: '👁️',
    gradient: 'linear-gradient(135deg, #4b0082 0%, #8b008b 50%, #9370db 100%)',
    badge: 'aberração'
  },
  fey: {
    icon: '🧚',
    gradient: 'linear-gradient(135deg, #228b22 0%, #20b2aa 50%, #3cb371 100%)',
    badge: 'fey'
  },
  monstro: {
    icon: '👹',
    gradient: 'linear-gradient(135deg, #8b0000 0%, #c71585 50%, #dc143c 100%)',
    badge: 'monstro'
  },
  construção: {
    icon: '⚙️',
    gradient: 'linear-gradient(135deg, #2f4f4f 0%, #006666 50%, #4682b4 100%)',
    badge: 'construção'
  },
  default: {
    icon: '🐺',
    gradient: 'linear-gradient(135deg, #2d2d5f 0%, #4a4a6e 50%, #6a6a8e 100%)',
    badge: 'geral'
  }
};

const MonsterCard = ({ monster, currentPage }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const displayName = monster.namePt || monster.name;
  const monsterType = monster.type?.toLowerCase() || 'default';
  const typeInfo = typeData[monsterType] || typeData.default;
  const crValue = monster.challenge_rating;

  const formatCR = (cr) => {
    if (cr === 'Unknown') return '?';
    if (cr === '0') return '0';
    if (cr === '1/4') return '1/4';
    if (cr === '1/2') return '1/2';
    return cr;
  };

  const getCRText = (cr) => {
    if (cr === 'Unknown') return 'Desconhecido';
    if (parseFloat(cr) <= 1) return 'Fácil';
    if (parseFloat(cr) <= 5) return 'Médio';
    if (parseFloat(cr) <= 10) return 'Difícil';
    return 'Lendário';
  };

  const [searchParams] = useSearchParams();
  return (
    <Link 
      to={`/monster/${monster.id}?${searchParams.toString()}`}
      state={{ page: currentPage }}
      className="monster-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="monster-card-outer">
        <div className="monster-card-frame">
          <div className="monster-card-content">
            {/* Header Section */}
            <div className="monster-header">
              <div className="type-badge">
                <span className="type-icon">{typeInfo.icon}</span>
                <span className="type-text">{monster.type}</span>
              </div>
              <div className="cr-badge">
                <span className="cr-value">CR {formatCR(crValue)}</span>
                <span className="cr-text">{getCRText(crValue)}</span>
              </div>
            </div>

            {/* Image Section */}
            <div className="monster-image-container">
              {monster.image && !imageError ? (
                <img
                  src={monster.image}
                  alt={monster.name}
                  loading="lazy"
                  className="monster-image"
                  width="400"
                  height="200"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="monster-placeholder">
                  <div className="placeholder-background" style={{ background: typeInfo.gradient }}>
                    <div className="placeholder-content">
                      <span className="placeholder-icon">{typeInfo.icon}</span>
                      <span className="placeholder-name">{displayName.charAt(0).toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              )}
              <div className="image-overlay"></div>
            </div>

            {/* Monster Stats */}
            <div className="monster-stats">
              <div className="monster-size">
                <span className="size-label">Tamanho</span>
                <span className="size-value">{monster.size}</span>
              </div>
              {monster.alignment && (
                <div className="monster-alignment">
                  <span className="alignment-label">Alinhamento</span>
                  <span className="alignment-value">{monster.alignment}</span>
                </div>
              )}
            </div>

            {/* Monster Name */}
            <div className="monster-name">
              <h3>{displayName}</h3>
              <div className="name-decoration"></div>
            </div>

            {/* Scenario Badges */}
            {(monster.regionData || monster.environmentData) && (
              <div className="scenario-badges">
                {monster.regionData && (
                  <span className="scenario-badge region-badge" title={monster.regionData.description}>
                    {monster.regionData.icon} {monster.regionData.name}
                  </span>
                )}
                {monster.environmentData && (
                  <span className="scenario-badge environment-badge" title={monster.environmentData.description}>
                    {monster.environmentData.icon} {monster.environmentData.name}
                  </span>
                )}
              </div>
            )}

            {/* Hover Effect */}
            {isHovered && (
              <div className="card-glow"></div>
            )}
          </div>
          
          {/* Card Border */}
          <div className="card-border"></div>
        </div>
      </div>
    </Link>
  );
};

export default memo(MonsterCard, (prevProps, nextProps) => {
  return prevProps.monster.id === nextProps.monster.id;
});