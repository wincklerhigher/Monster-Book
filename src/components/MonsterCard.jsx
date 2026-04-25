import { useState } from 'react';
import { Link } from 'react-router-dom';
import './MonsterCard.css';

const gradientsByType = {
  dragon: 'linear-gradient(135deg, #7c2d12 0%, #1e3a5f 100%)',
  undead: 'linear-gradient(135deg, #1f2937 0%, #581c87 100%)',
  beast: 'linear-gradient(135deg, #78350f 0%, #14532d 100%)',
  elemental: 'linear-gradient(135deg, #c2410c 0%, #a16207 100%)',
  fiend: 'linear-gradient(135deg, #7f1d1d 0%, #000 100%)',
  construct: 'linear-gradient(135deg, #475569 0%, #0f766e 100%)',
  aberration: 'linear-gradient(135deg, #581c87 0%, #be185d 100%)',
  fey: 'linear-gradient(135deg, #065f46 0%, #0e7490 100%)',
  giant: 'linear-gradient(135deg, #44403c 0%, #b45309 100%)',
  humanoid: 'linear-gradient(135deg, #1e40af 0%, #334155 100%)',
  monstrosity: 'linear-gradient(135deg, #881337 0%, #be123c 100%)',
  ooze: 'linear-gradient(135deg, #052e16 0%, #65a30d 100%)',
  plant: 'linear-gradient(135deg, #14532d 0%, #064e3b 100%)',
  default: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)',
};

const getGradientForType = (type) => {
  return gradientsByType[type?.toLowerCase()] || gradientsByType.default;
};

const MonsterCard = ({ monster }) => {
  const [imageError, setImageError] = useState(false);
  const displayName = monster.namePt || monster.name;

  return (
    <Link to={`/monster/${monster.id}`} className="monster-card-link">
      <div className="monster-card">
        <div className="card-image" style={{ background: getGradientForType(monster.type) }}>
          {monster.image && !imageError ? (
            <img
              src={monster.image}
              alt={monster.name}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="placeholder" style={{ background: getGradientForType(monster.type) }}>
            </div>
          )}
        </div>
        <div className="card-content">
          <h3 className="card-title">{displayName}</h3>
          <div className="card-stats">
            <span className="badge cr">CR {monster.challenge_rating}</span>
            <span className="badge type">{monster.type}</span>
            <span className="badge size">{monster.size}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MonsterCard;