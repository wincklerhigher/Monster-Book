export const sizeMap = {
  'Pequeno': 'Small',
  'Médio': 'Medium',
  'Grande': 'Large',
  'Gigante': 'Huge',
  'Enorme': 'Huge',
  'Imenso': 'Gargantuan',
  'Minúsculo': 'Tiny'
};

export const typeMap = {
  'Dragão': 'dragon',
  'Morto-vivo': 'undead',
  'Besta': 'beast',
  'Humanoide': 'humanoid',
  'Monstro': 'monstrosity',
  'Elemental': 'elemental',
  'Aberração': 'aberration',
  'Fey': 'fey',
  'Gigante': 'giant',
  'Constructo': 'construct',
  'Demônio': 'fiend',
  'Fada': 'fey'
};

export const reverseSizeMap = {
  'tiny': 'Minúsculo',
  'small': 'Pequeno',
  'medium': 'Médio',
  'large': 'Grande',
  'huge': 'Gigante',
  'gargantuan': 'Imenso'
};

export const reverseTypeMap = {
  'dragon': 'Dragão',
  'undead': 'Morto-vivo',
  'beast': 'Besta',
  'humanoid': 'Humanoide',
  'monstrosity': 'Monstro',
  'elemental': 'Elemental',
  'aberration': 'Aberração',
  'fey': 'Fey',
  'giant': 'Gigante',
  'construct': 'Constructo',
  'fiend': 'Demônio',
  'celestial': 'Celestial',
  'ooze': 'Geleia',
  'plant': 'Planta',
  'swarm': 'Enxame',
  'magical-beast': 'Besta Mágica'
};

export const normalizeFilterValue = (filterType, value) => {
  if (filterType === 'size') return sizeMap[value] || value;
  if (filterType === 'type') return typeMap[value] || value;
  return value;
};

export const normalizeFilterForComparison = (filterType, monsterValue) => {
  if (filterType === 'size') return reverseSizeMap[monsterValue?.toLowerCase()] || monsterValue;
  if (filterType === 'type') return reverseTypeMap[monsterValue?.toLowerCase()] || monsterValue;
  return monsterValue;
};