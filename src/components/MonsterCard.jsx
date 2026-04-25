import { useState } from 'react';
import './MonsterCard.css';

const getMonsterIcon = (type) => {
  const icons = {
    dragon: '🐉',
    undead: '💀',
    beast: '🦁',
    elemental: '🔥',
    fiend: '😈',
    construct: '⚙️',
    aberration: '👁️',
    fey: '🧚',
    giant: '🗿',
    humanoid: '👤',
    monstrosity: '👹',
    ooze: '🟤',
    plant: '🌿',
    default: '🐲',
  };
  return icons[type?.toLowerCase()] || icons.default;
};

const getMonsterColor = (type) => {
  const colors = {
    dragon: 'from-red-900/50 to-orange-900/50',
    undead: 'from-gray-800/50 to-purple-900/50',
    beast: 'from-amber-900/50 to-green-900/50',
    elemental: 'from-orange-900/50 to-yellow-900/50',
    fiend: 'from-red-950/50 to-black/50',
    construct: 'from-slate-800/50 to-teal-900/50',
    aberration: 'from-purple-950/50 to-pink-900/50',
    fey: 'from-emerald-900/50 to-cyan-900/50',
    giant: 'from-stone-800/50 to-amber-900/50',
    humanoid: 'from-blue-900/50 to-slate-900/50',
    monstrosity: 'from-red-950/50 to-rose-900/50',
    ooze: 'from-green-950/50 to-lime-900/50',
    plant: 'from-green-900/50 to-emerald-950/50',
    default: 'from-slate-800/50 to-indigo-900/50',
  };
  return colors[type?.toLowerCase()] || colors.default;
};

const MonsterCard = ({ monster }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="monster-card">
      <div className={`card-image bg-gradient-to-br ${getMonsterColor(monster.type)}`}>
        {monster.image && !imageError ? (
          <img 
            src={monster.image} 
            alt={monster.name}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="placeholder">
            <span className="placeholder-icon">{getMonsterIcon(monster.type)}</span>
            <span className="placeholder-name">{monster.name.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="card-content">
        <h3 className="card-title">{monster.name}</h3>
        <div className="card-stats">
          <span className="badge cr">CR {monster.challenge_rating}</span>
          <span className="badge type">{monster.type}</span>
          <span className="badge size">{monster.size}</span>
        </div>
      </div>
    </div>
  );
};

export default MonsterCard;