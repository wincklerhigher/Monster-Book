const BASE_URL = 'https://api.open5e.com/v1';

/**
 * Fetch monsters from Open5e API with pagination and filters.
 * @param {Object} options - { page, cr, type, search }
 * @returns {Promise<{monsters: Array, count: number}>}
 */
export const fetchMonsters = async ({ page = 1, cr = '', type = '', search = '' } = {}) => {
  const params = new URLSearchParams();
  if (page > 1) params.set('page', page);
  if (cr) params.set('cr', cr);
  if (type) params.set('type', type);
  if (search) params.set('search', search);
  
  const queryString = params.toString();
  const url = `${BASE_URL}/monsters/${queryString ? '?' + queryString : ''}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch monsters: ${response.status}`);
  }
  
  const data = await response.json();
  return {
    monsters: data.results || [],
    count: data.count || 0,
    next: data.next,
    previous: data.previous,
  };
};

import { translateMonsterName } from './translations';

/**
 * Normalize Open5e monster to our app format.
 * @param {Object} monster - Raw monster from Open5e
 * @returns {Object} Normalized monster
 */
export const normalizeMonster = (monster) => {
  const slug = monster.slug || monster.name?.toLowerCase().replace(/\s+/g, '-') || '';
  const imageUrl = getMonsterImage(slug, monster.name, monster.img_url);
  
  return {
    id: slug,
    name: monster.name || 'Unknown',
    namePt: translateMonsterName(monster.name) || monster.name || 'Unknown',
    challenge_rating: monster.challenge_rating || 'Unknown',
    size: monster.size || 'Medium',
    type: monster.type || 'unknown',
    alignment: monster.alignment || 'unaligned',
    armor_class: parseArmorClass(monster.armor_class),
    hit_points: parseHitPoints(monster.hit_points),
    speed: monster.speed || '30 ft.',
    strength: monster.strength || 10,
    dexterity: monster.dexterity || 10,
    constitution: monster.constitution || 10,
    intelligence: monster.intelligence || 10,
    wisdom: monster.wisdom || 10,
    charisma: monster.charisma || 10,
    image: imageUrl,
    actions: parseActions(monster.actions),
    special_abilities: parseSpecialAbilities(monster.special_abilities),
    description: monster.desc || '',
    source: monster.document || 'SRD',
    tags: [],
    notes: '',
  };
};

const getMonsterImage = (slug, name, existingUrl) => {
  if (existingUrl) return existingUrl;
  
  const knownImages = {
    'aboleth': 'https://5e.tools/img/monsters/CR5.webp',
    'acolyte': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'animated-armor': 'https://5e.tools/img/monsters/CR%201.jpg',
    'ankheg': 'https://5e.tools/img/monsters/CR2.webp',
    'ape': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'archmage': 'https://5e.tools/img/monsters/CR12.jpg',
    'assassin': 'https://5e.tools/img/monsters/CR8.jpg',
    'awakened-tree': 'https://5e.tools/img/monsters/CR2.webp',
    'azer': 'https://5e.tools/img/monsters/CR2.webp',
    'badger': 'https://5e.tools/img/monsters/CR%20%C2%BC.jpg',
    'balor': 'https://5e.tools/img/monsters/CR19.jpg',
    'bandit': 'https://5e.tools/img/monsters/CR%20%C2%BC.jpg',
    'bandit-captain': 'https://5e.tools/img/monsters/CR2.webp',
    'banshee': 'https://5e.tools/img/monsters/CR4.jpg',
    'basilisk': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'bearded-devil': 'https://5e.tools/img/monsters/CR5.webp',
    'berserker': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'black-dragon': 'https://5e.tools/img/monsters/CR14.jpg',
    'black-pudding': 'https://5e.tools/img/monsters/CR4.jpg',
    'blink-dog': 'https://5e.tools/img/monsters/CR%20%C2%BC.jpg',
    'bone-devil': 'https://5e.tools/img/monsters/CR9.jpg',
    'bulette': 'https://5e.tools/img/monsters/CR5.webp',
    'carrion-crawler': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'cartographer': 'https://5e.tools/img/monsters/CR2.webp',
    'centaur': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'chimera': 'https://5e.tools/img/monsters/CR6.webp',
    'chuul': 'https://5e.tools/img/monsters/CR4.jpg',
    'clay-golem': 'https://5e.tools/img/monsters/CR9.jpg',
    'cleric': 'https://5e.tools/img/monsters/CR2.webp',
    'cloud-giant': 'https://5e.tools/img/monsters/CR9.jpg',
    'cockatrice': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'copper-dragon': 'https://5e.tools/img/monsters/CR10.webp',
    'deep-gnome': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'death-tarantula': 'https://5e.tools/img/monsters/CR4.jpg',
    'demilich': 'https://5e.tools/img/monsters/CR13.jpg',
    'displacer-beast': 'https://5e.tools/img/monsters/CR3.webp',
    'doppelganger': 'https://5e.tools/img/monsters/CR3.webp',
    'dragon-turtle': 'https://5e.tools/img/monsters/CR22.jpg',
    'dragonborn': 'https://5e.tools/img/monsters/CR%20%C2%BC.jpg',
    'dretch': 'https://5e.tools/img/monsters/CR%20%C2%BC.jpg',
    'drider': 'https://5e.tools/img/monsters/CR6.webp',
    'drow': 'https://5e.tools/img/monsters/CR%20%C2%BC.jpg',
    'druid': 'https://5e.tools/img/monsters/CR2.webp',
    'dryad': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'duergar': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'efreeti': 'https://5e.tools/img/monsters/CR13.jpg',
    'earth-elemental': 'https://5e.tools/img/monsters/CR5.webp',
    'elder-brain': 'https://5e.tools/img/monsters/CR14.jpg',
    'fire-elemental': 'https://5e.tools/img/monsters/CR5.webp',
    'fire-giant': 'https://5e.tools/img/monsters/CR8.jpg',
    'flameskull': 'https://5e.tools/img/monsters/CR4.jpg',
    'flesh-golem': 'https://5e.tools/img/monsters/CR5.webp',
    'frost-giant': 'https://5e.tools/img/monsters/CR8.jpg',
    'galeb-dhr': 'https://5e.tools/img/monsters/CR2.webp',
    'gargoyle': 'https://5e.tools/img/monsters/CR2.webp',
    'gelatinous-cube': 'https://5e.tools/img/monsters/CR2.webp',
    'ghoul': 'https://5e.tools/img/monsters/CR1.jpg',
    'giant-crocodile': 'https://5e.tools/img/monsters/CR5.webp',
    'giant-spider': 'https://5e.tools/img/monsters/CR1.jpg',
    'gnoll': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'gnome': 'https://5e.tools/img/monsters/CR%20%C2%BC.jpg',
    'goblin': 'https://5e.tools/img/monsters/CR%20%C2%BC.jpg',
    'gorgon': 'https://5e.tools/img/monsters/CR5.webp',
    'gray-slime': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'green-dragon': 'https://5e.tools/img/monsters/CR15.jpg',
    'guardian-naga': 'https://5e.tools/img/monsters/CR10.webp',
    'gynosphinx': 'https://5e.tools/img/monsters/CR9.jpg',
    'harpy': 'https://5e.tools/img/monsters/CR1.jpg',
    'hell-hound': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'helmed-horror': 'https://5e.tools/img/monsters/CR4.jpg',
    'hill-giant': 'https://5e.tools/img/monsters/CR5.webp',
    'hippogriff': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'hobgoblin': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'homunculus': 'https://5e.tools/img/monsters/CR%20%C2%BC.jpg',
    'hook-horror': 'https://5e.tools/img/monsters/CR3.webp',
    'hydra': 'https://5e.tools/img/monsters/CR8.jpg',
    'intellect-devourer': 'https://5e.tools/img/monsters/CR12.jpg',
    'iron-golem': 'https://5e.tools/img/monsters/CR10.webp',
    'kobold': 'https://5e.tools/img/monsters/CR%20%C2%BC.jpg',
    'kraken': 'https://5e.tools/img/monsters/CR17.jpg',
    'lamia': 'https://5e.tools/img/monsters/CR4.jpg',
    'lich': 'https://5e.tools/img/monsters/CR21.jpg',
    'lizardfolk': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'mage': 'https://5e.tools/img/monsters/CR6.webp',
    'marid': 'https://5e.tools/img/monsters/CR11.jpg',
    'medusa': 'https://5e.tools/img/monsters/CR6.webp',
    'merrow': 'https://5e.tools/img/monsters/CR2.webp',
    'mimic': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'minotaur': 'https://5e.tools/img/monsters/CR3.webp',
    'mummy': 'https://5e.tools/img/monsters/CR3.webp',
    'mummy-lord': 'https://5e.tools/img/monsters/CR15.jpg',
    'nightmare': 'https://5e.tools/img/monsters/CR3.webp',
    'ogre': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'ogre-mage': 'https://5e.tools/img/monsters/CR4.jpg',
    'oni': 'https://5e.tools/img/monsters/CR7.jpg',
    'orc': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'otyugh': 'https://5e.tools/img/monsters/CR5.webp',
    'owlbear': 'https://5e.tools/img/monsters/CR3.webp',
    'pegasus': 'https://5e.tools/img/monsters/CR2.webp',
    'peryton': 'https://5e.tools/img/monsters/CR2.webp',
    'piercer': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'pixie': 'https://5e.tools/img/monsters/CR%20%C2%BC.jpg',
    'polar-bear': 'https://5e.tools/img/monsters/CR2.webp',
    'pteranodon': 'https://5e.tools/img/monsters/CR%20%C2%BC.jpg',
    'quasit': 'https://5e.tools/img/monsters/CR%20%C2%BC.jpg',
    'quipper': 'https://5e.tools/img/monsters/CR%20%C2%BC.jpg',
    'red-dragon': 'https://5e.tools/img/monsters/CR17.jpg',
    'revenant': 'https://5e.tools/img/monsters/CR5.webp',
    'roc': 'https://5e.tools/img/monsters/CR11.jpg',
    'rope-mummy': 'https://5e.tools/img/monsters/CR2.webp',
    'rust-monster': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'sahuagin': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'salamander': 'https://5e.tools/img/monsters/CR5.webp',
    'satyr': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'scarab-golem': 'https://5e.tools/img/monsters/CR5.webp',
    'sea-hag': 'https://5e.tools/img/monsters/CR2.webp',
    'shambling-mound': 'https://5e.tools/img/monsters/CR5.webp',
    'shield-guardian': 'https://5e.tools/img/monsters/CR7.jpg',
    'shocker-lizard': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'skeleton': 'https://5e.tools/img/monsters/Skeleton.jpg',
    'slaad': 'https://5e.tools/img/monsters/CR7.jpg',
    'smoke-dragon': 'https://5e.tools/img/monsters/CR17.jpg',
    'sphinx': 'https://5e.tools/img/monsters/CR17.jpg',
    'spy': 'https://5e.tools/img/monsters/CR1.jpg',
    'steam-dragon': 'https://5e.tools/img/monsters/CR15.jpg',
    'stone-giant': 'https://5e.tools/img/monsters/CR7.jpg',
    'stone-golem': 'https://5e.tools/img/monsters/CR10.webp',
    'tarrasque': 'https://5e.tools/img/monsters/CR30.jpg',
    'thought-guardian': 'https://5e.tools/img/monsters/CR5.webp',
    'troll': 'https://5e.tools/img/monsters/Troll.jpg',
    'umber-hulk': 'https://5e.tools/img/monsters/CR5.webp',
    'unicorn': 'https://5e.tools/img/monsters/CR2.webp',
    'vampire': 'https://5e.tools/img/monsters/CR13.jpg',
    'vampire-spawn': 'https://5e.tools/img/monsters/CR5.webp',
    'vampire-lord': 'https://5e.tools/img/monsters/CR15.jpg',
    'warhorse': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'werebear': 'https://5e.tools/img/monsters/CR5.webp',
    'wereboar': 'https://5e.tools/img/monsters/CR4.jpg',
    'wererat': 'https://5e.tools/img/monsters/CR2.webp',
    'weretiger': 'https://5e.tools/img/monsters/CR4.jpg',
    'werewolf': 'https://5e.tools/img/monsters/CR3.webp',
    'will-o-wisp': 'https://5e.tools/img/monsters/CR2.webp',
    'winter-eladrin': 'https://5e.tools/img/monsters/CR%20%C2%BD.jpg',
    'wraith': 'https://5e.tools/img/monsters/CR5.webp',
    'wyvern': 'https://5e.tools/img/monsters/CR6.webp',
    'xorn': 'https://5e.tools/img/monsters/CR5.webp',
    'yeti': 'https://5e.tools/img/monsters/CR3.webp',
    'yuan-ti-abomination': 'https://5e.tools/img/monsters/CR5.webp',
    'zombie': 'https://5e.tools/img/monsters/Zombie.jpg',
  };
  
  return knownImages[slug] || monster.img_url || '';
};

const parseArmorClass = (ac) => {
  if (!ac) return 10;
  if (typeof ac === 'number') return ac;
  const match = ac.toString().match(/\d+/);
  return match ? parseInt(match[0]) : 10;
};

const parseHitPoints = (hp) => {
  if (!hp) return 10;
  if (typeof hp === 'number') return hp;
  const match = hp.toString().match(/\d+/);
  return match ? parseInt(match[0]) : 10;
};

const parseActions = (actions) => {
  if (!actions) return [];
  if (Array.isArray(actions)) {
    return actions.map(a => ({
      name: a.name || `Action`,
      description: a.desc || a.description || '',
    }));
  }
  return actions.split('\n').filter(Boolean).map((action, i) => ({
    name: `Action ${i + 1}`,
    description: action.trim(),
  }));
};

const parseSpecialAbilities = (abilities) => {
  if (!abilities) return [];
  if (Array.isArray(abilities)) {
    return abilities.map(a => ({
      name: a.name || `Ability`,
      description: a.desc || a.description || '',
    }));
  }
  return abilities.split('\n').filter(Boolean).map((ability, i) => ({
    name: `Special Ability ${i + 1}`,
    description: ability.trim(),
  }));
};

/**
 * Fetch all monster types available.
 * @returns {Promise<Array>}
 */
export const fetchMonsterTypes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/monsters/`);
    const data = await response.json();
    const types = new Set();
    data.results?.forEach(m => {
      if (m.type) types.add(m.type);
    });
    return Array.from(types).sort();
  } catch {
    return [];
  }
};

export const fetchMonsterBySlug = async (slug) => {
  const cleanSlug = slug.replace(/-/g, ' ');
  
  const prefixes = ['accursed', 'cursed', 'blessed', 'sacred', 'corrupted', 'armored', 'heavy', 'light'];
  let searchTerm = cleanSlug;
  for (const prefix of prefixes) {
    searchTerm = searchTerm.replace(new RegExp(`^${prefix}\\s+`, 'i'), '');
  }
  
  searchTerm = searchTerm.trim();
  if (!searchTerm) {
    throw new Error('Monster not found');
  }
  
  const trySearch = async (term) => {
    const response = await fetch(`${BASE_URL}/monsters/?search=${encodeURIComponent(term)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch monster: ${response.status}`);
    }
    return response.json();
  };
  
  let data = await trySearch(searchTerm);
  let monster = data.results?.find(m => m.slug === slug);
  
  if (!monster && data.results?.length > 0) {
    monster = data.results[0];
  }
  
  if (!monster) {
    const altData = await trySearch(cleanSlug);
    monster = altData.results?.find(m => m.slug === slug);
    if (!monster && altData.results?.length > 0) {
      monster = altData.results[0];
    }
  }
  
  if (!monster) {
    throw new Error('Monster not found');
  }
  return monster;
};