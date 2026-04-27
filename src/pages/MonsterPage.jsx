import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { fetchMonsterBySlug, normalizeMonster } from '../services/open5eApi';
import { addNotFoundMonster, removeFromNotFoundList } from '../services/notFoundStore';
import LanguageSwitch from '../components/LanguageSwitch';
import StatBlock from '../components/StatBlock';
import Footer from '../components/Footer';
import '../styles/MonsterPage.css';

const MonsterPage = () => {
  const navigate = useNavigate();
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
        console.log('Fetching monster with id:', id);
        const data = await fetchMonsterBySlug(id);
        if (!data) {
          console.log('No data returned for slug:', id);
          throw new Error(t('monsterNotFound'));
        }
        console.log('Monster loaded:', data.name, 'slug:', data.slug);
        setMonster(normalizeMonster(data));
      } catch (e) {
        console.error('Error loading monster:', e.message, 'id was:', id);
        setError(t('monsterNotFound'));
        addNotFoundMonster(id);
      } finally {
        setLoading(false);
      }
    };
    loadMonster();
  }, [id, t]);

  if (loading) return (
    <div className="monster-page">
      <div className="monster-loading">
        <div className="loading-spinner" />
        <p>{t('loading')}</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="monster-page">
      <div className="monster-error">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>{t('back')}</button>
      </div>
    </div>
  );

  if (!monster) return null;

  return (
    <div className="monster-page">
      <div className="page-background"><div className="page-vignette" /></div>
      <div className="page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>{t('back')}
        </button>
        <LanguageSwitch />
      </div>

      <div className="monster-detail">
        {/* Optional media */}
        {monster.image && (
          <div className="monster-media"><img src={monster.image} alt={monster.name} width="800" height="400" /></div>
        )}

        <h1 className="monster-name">{monster.namePt || monster.name}</h1>
        <div className="monster-basic">
          <span className="crt">{t('cr')}: {monster.challenge_rating}</span>
          <span className="type">{t('type')}: {monster.type}</span>
          <span className="size">{t('size')}: {monster.size}</span>
          {monster.alignment && (
            <span className="alignment">{t('alignment')}: {monster.alignment}</span>
          )}
        </div>

        {/* Scenario Context */}
        {(monster.settingData || monster.regionData || monster.environmentData) && (
          <div className="scenario-context">
            {monster.settingData && (
              <div className="context-setting">
                <span className="context-icon">{monster.settingData.icon}</span>
                <span className="context-label">{monster.settingData.name}</span>
              </div>
            )}
            {monster.regionData && (
              <div className="context-item">
                <span className="context-icon">{monster.regionData.icon}</span>
                <div className="context-info">
                  <span className="context-label">Região</span>
                  <span className="context-value">{monster.regionData.name}</span>
                </div>
              </div>
            )}
            {monster.environmentData && (
              <div className="context-item">
                <span className="context-icon">{monster.environmentData.icon}</span>
                <div className="context-info">
                  <span className="context-label">Ambiente</span>
                  <span className="context-value">{monster.environmentData.name}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Lore Section */}
        {monster.lore && (
          <section className="monster-lore">
            <h2 className="section-title lore-title">
              <span className="title-icon">📜</span>
              Lore de Faerûn
            </h2>
            <p className="lore-text">{monster.lore}</p>
          </section>
        )}

        <hr className="separator" />
        <StatBlock stats={monster} />

        {monster.actions && monster.actions.length > 0 && (
          <section className="monster-actions">
            <h2 className="section-title">{t('actions')}</h2>
            <ul className="actions-list">
              {monster.actions.map((action, i) => (
                <li key={i} className="action-item">
                  <span className="action-name">{action.name}:</span>
                  <span className="action-desc">{action.description}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        {monster.special_abilities && monster.special_abilities.length > 0 && (
          <section className="monster-abilities">
            <h2 className="section-title">{t('specialAbilities')}</h2>
            <ul className="abilities-list">
              {monster.special_abilities.map((ab, i) => (
                <li key={i} className="ability-item">
                  <span className="ability-name">{ab.name}:</span>
                  <span className="ability-desc">{ab.description}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        {monster.tags && monster.tags.length > 0 && (
          <section className="monster-tags">
            <h2 className="section-title">{t('tags')}</h2>
            <div className="tags-container">
              {monster.tags.map((tag, i) => (
                <span key={i} className="tag">{tag}</span>
              ))}
            </div>
          </section>
        )}
        {monster.notes && (
          <section className="monster-notes">
            <h2 className="section-title">{t('notes')}</h2>
            <p>{monster.notes}</p>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MonsterPage;
