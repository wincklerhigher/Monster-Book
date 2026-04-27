import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { fetchMonsterBySlug, normalizeMonster } from '../services/open5eApi';
import { addNotFoundMonster, removeFromNotFoundList } from '../services/notFoundStore';
import LanguageSwitch from '../components/LanguageSwitch';
import StatBlock from '../components/StatBlock';
import Footer from '../components/Footer';
import '../styles/MonsterPage.css';

const MonsterPage = () => {
  const { id } = useParams();
  const [monster, setMonster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    removeFromNotFoundList(id);
    const loadMonster = async () => {
      try {
        setLoading(true);
        const data = await fetchMonsterBySlug(id);
        if (!data) {
          setError(t('monsterNotFound'));
          addNotFoundMonster(id);
          return;
        }
        const normalized = normalizeMonster(data);
        setMonster(normalized);
      } catch (err) {
        setError(t('monsterNotFound'));
        addNotFoundMonster(id);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMonster();
  }, [id, t]);

  if (loading) return <div className="loading">{t('loading')}</div>;
  if (error) return <div className="error">{error}</div>;
  if (!monster) return <div className="not-found">{t('monsterNotFound')}</div>;

  return (
    <div className="monster-page">
      <div className="page-header">
        <button className="back-button" onClick={() => window.history.back()}>
          ← {t('back')}
        </button>
        <LanguageSwitch />
      </div>
      <div className="monster-detail">
        <h1 className="monster-name">{monster.namePt || monster.name}</h1>
        <div className="monster-stats">
          <span className="badge cr">CR {monster.challenge_rating}</span>
          <span className="badge type">{monster.type}</span>
          <span className="badge size">{monster.size}</span>
          {monster.alignment && (
            <span className="badge alignment">{monster.alignment}</span>
          )}
        </div>
        {monster.image ? (
          <img src={monster.image} alt={monster.name} className="monster-image" loading="lazy" />
        ) : (
          <div className="placeholder-image">{t('noImage')}</div>
        )}
        <StatBlock stats={monster} />
        {monster.actions && monster.actions.length > 0 && (
          <div className="section">
            <h2>{t('actions')}</h2>
            <ul className="actions-list">
              {monster.actions.map((action, index) => (
                <li key={index} className="action-item">
                  <strong>{action.name}:</strong> {action.description}
                </li>
              ))}
            </ul>
          </div>
        )}
        {monster.special_abilities && monster.special_abilities.length > 0 && (
          <div className="section">
            <h2>{t('specialAbilities')}</h2>
            <ul className="abilities-list">
              {monster.special_abilities.map((ability, index) => (
                <li key={index} className="ability-item">
                  <strong>{ability.name}:</strong> {ability.description}
                </li>
              ))}
            </ul>
          </div>
        )}
        {monster.tags && monster.tags.length > 0 && (
          <div className="section tags-section">
            <h2>{t('tags')}</h2>
            <div className="tags">
              {monster.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        )}
        {monster.notes && (
          <div className="section notes-section">
            <h2>{t('notes')}</h2>
            <p className="note-text">{monster.notes}</p>
           </div>
         )}
       </div>
       <Footer />
     </div>
   );
};

export default MonsterPage;