import settingsData from '../data/scenario/settings.json';
import forgottenRealmsData from '../data/scenario/forgotten-realms.json';

const scenarios = new Map(
  settingsData.settings.map(s => [s.id, s])
);

const currentScenario = forgottenRealmsData;

export const getScenario = (id) => scenarios.get(id) || null;

export const getDefaultScenario = () => {
  return settingsData.settings.find(s => s.default) || settingsData.settings[0];
};

export const getAllScenarios = () => settingsData.settings;

export const getRegions = () => {
  return Object.entries(currentScenario.regions).map(([key, value]) => ({
    id: key,
    ...value
  }));
};

export const getRegion = (regionId) => {
  return currentScenario.regions[regionId] || null;
};

export const getEnvironments = () => {
  return Object.entries(currentScenario.environments).map(([key, value]) => ({
    id: key,
    ...value
  }));
};

export const getEnvironment = (envId) => {
  return currentScenario.environments[envId] || null;
};

export const getFactions = () => {
  return Object.entries(currentScenario.factions).map(([key, value]) => ({
    id: key,
    ...value
  }));
};

export const getSourceNote = (sourceSlug) => {
  return currentScenario.sourceNotes[sourceSlug] || null;
};

export const enrichMonsterWithScenario = (monster) => {
  const monsterId = monster.id?.toLowerCase() || '';
  const monsterName = monster.name?.toLowerCase() || '';
  
  let enhancement = null;
  if (currentScenario.monsterEnhancements) {
    // Find by partial match - check if any key is contained in monster ID
    // Sort by longest key first to match more specific variants (e.g., "desert-troll" before "troll")
    const entries = Object.entries(currentScenario.monsterEnhancements).sort((a, b) => b[0].length - a[0].length);
    for (const [key] of entries) {
      if (monsterId.includes(key.toLowerCase())) {
        enhancement = currentScenario.monsterEnhancements[key];
        break;
      }
    }
  }
  
  // Regra especial: trolls sem enhancement específico usam mountain
  if (!enhancement && monsterName.includes('troll')) {
    enhancement = {
      region: 'north',
      environment: 'mountain',
      lore: 'Criaturas regenerativas das terras frias do norte. São predadores terríveis que caçam qualquer coisa que se move.'
    };
  }

  if (!enhancement) {
    return {
      ...monster,
      setting: 'forgotten-realms',
      settingData: getDefaultScenario(),
      region: null,
      regionData: null,
      environment: null,
      environmentData: null,
      faction: null,
      lore: null
    };
  }

  const regionData = enhancement.region ? getRegion(enhancement.region) : null;
  const environmentData = enhancement.environment ? getEnvironment(enhancement.environment) : null;

  return {
    ...monster,
    setting: 'forgotten-realms',
    settingData: getDefaultScenario(),
    region: enhancement.region || null,
    regionData,
    environment: enhancement.environment || null,
    environmentData,
    faction: enhancement.faction || null,
    lore: enhancement.lore || null,
    threatTier: enhancement.threatTier || null,
    planes: enhancement.planes || null
  };
};

export const filterByRegion = (monsters, regionId) => {
  if (!regionId) return monsters;
  return monsters.filter(m => m.region === regionId);
};

export const filterByEnvironment = (monsters, envId) => {
  if (!envId) return monsters;
  return monsters.filter(m => m.environment === envId);
};

export default {
  getScenario,
  getDefaultScenario,
  getAllScenarios,
  getRegions,
  getRegion,
  getEnvironments,
  getEnvironment,
  getFactions,
  getSourceNote,
  enrichMonsterWithScenario,
  filterByRegion,
  filterByEnvironment
};