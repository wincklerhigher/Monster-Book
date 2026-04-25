import { useLanguage } from './LanguageContext';
import './LanguageSwitch.css';

const LanguageSwitch = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div className="language-switch">
      <button
        className={`lang-btn ${lang === 'pt' ? 'active' : ''}`}
        onClick={() => setLang('pt')}
      >
        PT
      </button>
      <button
        className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
        onClick={() => setLang('en')}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitch;