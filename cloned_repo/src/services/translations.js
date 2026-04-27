import translations from '../data/translations.json';

export const translateMonsterName = (name) => {
  if (!name) return name;
  const normalized = name.toLowerCase().trim();
  
  if (translations[normalized]) {
    return translations[normalized];
  }
  
  const words = normalized.split(' ');
  const excludeWords = ['young', 'ancient', 'adult', 'elder', 'wyrmling', 'spawn', 'pawn', 'brood', 'veteran', 'master', 'half', 'lesser', 'greater'];
  
  for (let i = words.length; i > 0; i--) {
    const partial = words.slice(0, i).join(' ');
    if (translations[partial]) {
      return translations[partial];
    }
    
    const filteredWords = words.filter(w => !excludeWords.includes(w));
    const filteredPartial = filteredWords.join(' ');
    if (filteredPartial && translations[filteredPartial]) {
      return translations[filteredPartial];
    }
  }
  
  const cleanName = normalized
    .replace(/\s*(young|ancient|adult|elder|wyrmling|spawn|pawn|brood|veteran|master|half|lesser|greater)\s*/gi, ' ')
    .replace(/\s*\(.*?\)\s*/gi, ' ')
    .replace(/^\s+|\s+$/g, '')
    .replace(/\s+/g, ' ');
  
  if (translations[cleanName]) {
    return translations[cleanName];
  }
  
  return name;
};