import { useLanguage } from '../context/LanguageContext';
import LanguageSwitch from './LanguageSwitch';
import './Hero.css';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <header className="hero">
      <div className="hero-top">
        <LanguageSwitch />
      </div>
      <h1 className="hero-title">{t('heroTitle')}</h1>
      <p className="hero-subtitle">{t('heroSubtitle')}</p>
    </header>
  );
};

export default Hero;