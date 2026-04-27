import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';


const translations = {
  pt: {
    searchPlaceholder: 'Buscar monstros...',
    filterCr: 'Nível de Desafio (CR)',
    filterType: 'Tipo',
    filterSize: 'Tamanho',
    searchButton: 'Buscar',
    clearButton: 'Limpar',
    applyFilter: 'Filtrar',
    monsters: 'monstros',
    loading: 'Carregando...',
    sortByName: 'Ordenar por Nome',
    sortByCr: 'Ordenar por CR',
    noMonsters: 'Nenhum monstro encontrado.',
    tryAdjust: 'Tente ajustar os filtros ou buscar outro termo.',
    previous: 'Anterior',
    next: 'Próxima',
    page: 'Página',
    of: 'de',
    back: 'Voltar para lista',
    stats: 'Estatísticas',
    armorClass: 'Classe de Armadura',
    hitPoints: 'Pontos de Vida',
    speed: 'Velocidade',
    strength: 'Força',
    dexterity: 'Destreza',
    constitution: 'Constituição',
    intelligence: 'Inteligência',
    wisdom: 'Sabedoria',
    charisma: 'Carisma',
    actions: 'Ações',
    specialAbilities: 'Habilidades Especiais',
    tags: 'Tags',
    notes: 'Notas',
    noImage: 'Sem imagem disponível',
    monsterNotFound: 'Monstro não encontrado',
    failedLoad: 'Falha ao carregar detalhes do monstro',
    heroTitle: 'Livro dos Monstros',
    heroSubtitle: 'Descubra as melhores criaturas para suas aventuras',
  },
en: {
    searchPlaceholder: 'Search monsters...',
    filterCr: 'Challenge Rating (CR)',
    filterType: 'Type',
    filterSize: 'Size',
    searchButton: 'Search',
    clearButton: 'Clear',
    applyFilter: 'Filter',
    monsters: 'monsters',
    loading: 'Loading...',
    sortByName: 'Sort by Name',
    sortByCr: 'Sort by CR',
    noMonsters: 'No monsters found.',
    tryAdjust: 'Try adjusting filters or searching another term.',
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
    back: 'Back to list',
    stats: 'Statistics',
    armorClass: 'Armor Class',
    hitPoints: 'Hit Points',
    speed: 'Speed',
    strength: 'Strength',
    dexterity: 'Dexterity',
    constitution: 'Constitution',
    intelligence: 'Intelligence',
    wisdom: 'Wisdom',
    charisma: 'Charisma',
    actions: 'Actions',
    specialAbilities: 'Special Abilities',
    tags: 'Tags',
    notes: 'Notes',
    noImage: 'No image available',
    monsterNotFound: 'Monster not found',
    failedLoad: 'Failed to load monster details',
    heroTitle: 'Monster Book',
    heroSubtitle: 'Discover the best creatures for your adventures',
  },
};

const LanguageContext = createContext({
  lang: 'pt',
  setLang: () => {},
  t: (key) => key,
});

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lang') || 'pt';
    }
    return 'pt';
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const t = useCallback((key) => translations[lang][key] || key, [lang]);

  const contextValue = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};



export const useLanguage = () => useContext(LanguageContext);