import { useLanguage } from '../context/LanguageContext';
import LanguageSwitch from './LanguageSwitch';
import './Hero.css';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <header className="hero">
      <div className="hero-bg">
        <div className="hero-vignette"></div>
        <div className="hero-particles">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
      </div>
      <div className="hero-content">
        <div className="hero-top">
          <LanguageSwitch />
        </div>
        <div className="hero-main">
          <div className="hero-emblem">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 4L8 20v24l24 16 24-16V20L32 4z" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M32 16v16M24 24h16M20 32h24" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
              <circle cx="32" cy="32" r="6" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <h1 className="hero-title">
            <span className="hero-title-main">{t('heroTitle')}</span>
            <span className="hero-title-sub">Bestiário de D&D</span>
          </h1>
          <p className="hero-subtitle">{t('heroSubtitle')}</p>
          <div className="hero-decor">
            <span className="decor-line"></span>
            <span className="decor-diamond"></span>
            <span className="decor-line"></span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;