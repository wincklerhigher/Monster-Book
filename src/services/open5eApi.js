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

/**
 * Normalize Open5e monster to our app format.
 * @param {Object} monster - Raw monster from Open5e
 * @returns {Object} Normalized monster
 */
export const normalizeMonster = (monster) => {
  return {
    id: monster.slug,
    name: monster.name || 'Unknown',
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
    image: monster.img_url || '',
    actions: parseActions(monster.actions),
    special_abilities: parseSpecialAbilities(monster.special_abilities),
    description: monster.desc || '',
    source: monster.document || 'SRD',
    tags: [],
    notes: '',
  };
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
  if (Array.isArray(actions)) return actions;
  return actions.split('\n').filter(Boolean).map((action, i) => ({
    name: `Action ${i + 1}`,
    description: action.trim(),
  }));
};

const parseSpecialAbilities = (abilities) => {
  if (!abilities) return [];
  if (Array.isArray(abilities)) return abilities;
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
  const response = await fetch(`${BASE_URL}/monsters/${slug}/`);
  if (!response.ok) {
    throw new Error(`Failed to fetch monster: ${response.status}`);
  }
  return response.json();
};