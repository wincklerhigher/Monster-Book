import translations from '../data/translations.json';

export const translateMonsterName = (name) => {
  if (!name) return name;
  const normalizedKey = name.toLowerCase().trim();
  return translations[normalizedKey] || name;
};