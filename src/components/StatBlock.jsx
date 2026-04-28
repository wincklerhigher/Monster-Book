import { useLanguage } from '../context/Language-Context';
import './StatBlock.css';

const StatBlock = ({ stats }) => {
  const { t } = useLanguage();
  if (!stats) return null;

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

  return (
    <div className="stat-block">
      <h2>{t('stats')}</h2>
      <div className="stat-grid">
        <div className="stat-item">
          <span className="stat-label">{t('armorClass')}</span>
          <span className="stat-value">{stats.armor_class || 'N/A'}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{t('hitPoints')}</span>
          <span className="stat-value">{stats.hit_points || 'N/A'}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{t('speed')}</span>
          <span className="stat-value textual">{formatSpeed(stats.speed)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{t('strength')}</span>
          <span className="stat-value">{stats.strength || 10}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{t('dexterity')}</span>
          <span className="stat-value">{stats.dexterity || 10}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{t('constitution')}</span>
          <span className="stat-value">{stats.constitution || 10}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{t('intelligence')}</span>
          <span className="stat-value">{stats.intelligence || 10}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{t('wisdom')}</span>
          <span className="stat-value">{stats.wisdom || 10}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{t('charisma')}</span>
          <span className="stat-value">{stats.charisma || 10}</span>
        </div>
      </div>
    </div>
  );
};

export default StatBlock;