import './StatBlock.css';

const formatSpeed = (speed) => {
  if (!speed) return 'N/A';
  if (typeof speed === 'string') return speed;
  if (typeof speed === 'object') {
    return Object.entries(speed)
      .map(([type, value]) => `${value} ${type}`)
      .join(', ');
  }
  return String(speed);
};

const StatBlock = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="stat-block">
      <h2>Estatísticas</h2>
      <div className="stat-grid">
        <div className="stat-item">
          <span className="stat-label">Classe de Armadura</span>
          <span className="stat-value">{stats.armor_class || 'N/A'}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pontos de Vida</span>
          <span className="stat-value">{stats.hit_points || 'N/A'}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Velocidade</span>
          <span className="stat-value">{formatSpeed(stats.speed)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Força</span>
          <span className="stat-value">{stats.strength || 10}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Destreza</span>
          <span className="stat-value">{stats.dexterity || 10}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Constituição</span>
          <span className="stat-value">{stats.constitution || 10}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Inteligência</span>
          <span className="stat-value">{stats.intelligence || 10}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Sabedoria</span>
          <span className="stat-value">{stats.wisdom || 10}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Carisma</span>
          <span className="stat-value">{stats.charisma || 10}</span>
        </div>
      </div>
    </div>
  );
};

export default StatBlock;