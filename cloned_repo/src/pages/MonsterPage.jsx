import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { fetchMonsterBySlug, normalizeMonster } from '../services/open5eApi';
import LanguageSwitch from '../components/LanguageSwitch';
import StatBlock from '../components/StatBlock';
import Footer from '../components/Footer';
import '../styles/MonsterPage.css';

const MonsterPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { t } = useLanguage();

  const [monster, setMonster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 origem real da navegação
  const backToList = location.state?.from || '/';

  useEffect(() => {
    const loadMonster = async () => {
      try {
        setLoading(true);
        const data = await fetchMonsterBySlug(id);

        if (!data) throw new Error();

        setMonster(normalizeMonster(data));
      } catch {
        setError(t('monsterNotFound'));
      } finally {
        setLoading(false);
      }
    };

    loadMonster();
  }, [id, t]);

  if (loading) return <p>{t('loading')}</p>;

  if (error)
    return (
      <div className="monster-error">
        <p>{error}</p>
        <button onClick={() => navigate(backToList)}>
          {t('back')}
        </button>
      </div>
    );

  return (
    <div className="monster-page">
      <div className="page-header">
        <button
          className="back-button"
          onClick={() => navigate(backToList)}
        >
          ← {t('back')}
        </button>

        <LanguageSwitch />
      </div>

      <h1>{monster.name}</h1>

      <StatBlock stats={monster} />

      <Footer />
    </div>
  );
};

export default MonsterPage;