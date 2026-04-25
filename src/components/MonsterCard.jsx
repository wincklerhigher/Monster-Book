import { useState } from 'react';
import { Link } from 'react-router-dom';
import './MonsterCard.css';

const typeGradients = {
  dragon: ['#8b0000', '#4a0000'],
  undead: ['#1a1a2e', '#4a0e4a'],
  beast: ['#654321', '#2d5016'],
  elemental: ['#ff4500', '#b8860b'],
  fiend: ['#500000', '#0a0a0a'],
  construct: ['#2f4f4f', '#006666'],
  aberration: ['#4b0082', '#8b008b'],
  fey: ['#228b22', '#20b2aa'],
  giant: ['#696969', '#daa520'],
  humanoid: ['#191970', '#4682b4'],
  monstrosity: ['#8b0000', '#c71585'],
  ooze: ['#006400', '#9acd32'],
  plant: ['#006400', '#2e8b57'],
  default: ['#1e1e3f', '#2d2d5f'],
};

const getGradientForType = (type) => {
  const colors = typeGradients[type?.toLowerCase()] || typeGradients.default;
  return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`;
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
              <span className="type-initial">{displayName.charAt(0).toUpperCase()}</span>
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