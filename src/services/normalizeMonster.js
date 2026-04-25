/**
 * Normalize monster data from D&D 5e API to a consistent format.
 * @param {Object} monster - Raw monster data from API
 * @returns {Object} Normalized monster object
 */
export const normalizeMonster = (monster) => {
  const strength = monster.strength || 10;
  const dexterity = monster.dexterity || 10;
  const constitution = monster.constitution || 10;
  const intelligence = monster.intelligence || 10;
  const wisdom = monster.wisdom || 10;
  const charisma = monster.charisma || 10;

  return {
    id: monster.index || monster.name?.toLowerCase().replace(/\s+/g, '-'),
    name: monster.name || 'Unknown Monster',
    challenge_rating: monster.challenge_rating || 'Unknown',
    size: monster.size || 'Medium',
    type: monster.type || 'unknown',
    alignment: monster.alignment || 'unaligned',
    armor_class: monster.armor_class?.[0]?.value || monster.armor_class || 10,
    hit_points: monster.hit_points || 10,
    speed: formatSpeed(monster.speed),
    strength,
    dexterity,
    constitution,
    intelligence,
    wisdom,
    charisma,
    image: monster.image || '',
    actions: monster.actions || [],
    special_abilities: monster.special_abilities || [],
    tags: monster.tags || [],
    notes: monster.notes || '',
    source: 'dnd5eapi'
  };
};

const formatSpeed = (speed) => {
  if (!speed) return '30 ft.';
  if (typeof speed === 'string') return speed;
  if (typeof speed === 'object') {
    return Object.entries(speed)
      .map(([key, value]) => `${key === 'walk' ? '' : key + ' '}${value}`)
      .join(', ');
  }
  return '30 ft.';
};

export default normalizeMonster;