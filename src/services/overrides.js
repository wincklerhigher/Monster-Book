import overridesData from '../data/overrides.json';

const overrides = new Map(
  (overridesData.overrides || []).map(o => [o.id, o])
);

export const getOverride = (id) => overrides.get(id) || null;

export const mergeWithOverride = (monster) => {
  const override = overrides.get(monster.id);
  if (!override) return monster;

  return {
    ...monster,
    image: override.image || monster.image,
    tags: override.tags || monster.tags,
    notes: override.notes || monster.notes,
  };
};

export const mergeAllWithOverrides = (monsters) => {
  return monsters.map(mergeWithOverride);
};

export default { getOverride, mergeWithOverride, mergeAllWithOverrides };