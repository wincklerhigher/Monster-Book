import './StatBlock.css';

const StatBlock = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="stat-block">
      <h2>Estatísticas</h2>
      <div className="stat-grid">
        <div className="stat-item">
          <span className="stat-label">Classe de Armadura</span>
          <span className="stat-value">{stats.armor_class}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pontos de Vida</span>
          <span className="stat-value">{stats.hit_points}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Velocidade</span>
          <span className="stat-value">{stats.speed}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Força</span>
          <span className="stat-value">{stats.strength}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Destreza</span>
          <span className="stat-value">{stats.dexterity}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Constituição</span>
          <span className="stat-value">{stats.constitution}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Inteligência</span>
          <span className="stat-value">{stats.intelligence}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Sabedoria</span>
          <span className="stat-value">{stats.wisdom}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Carisma</span>
          <span className="stat-value">{stats.charisma}</span>
        </div>
      </div>
    </div>
  );
};

export default StatBlock;