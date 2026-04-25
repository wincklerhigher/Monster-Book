const BASE_URL = 'https://www.dnd5eapi.co';

/**
 * Fetch the list of all monsters with full details from the D&D 5e API.
 * @returns {Promise<Array>} Array of complete monster objects.
 */
export const fetchMonsters = async () => {
  const response = await fetch(`${BASE_URL}/api/monsters`);
  if (!response.ok) {
    throw new Error(`Failed to fetch monsters: ${response.status}`);
  }
  const data = await response.json();
  
  const monsters = await Promise.all(
    data.results.slice(0, 50).map(async (monster) => {
      try {
        const detailResponse = await fetch(`${BASE_URL}${monster.url}`);
        if (!detailResponse.ok) return null;
        return detailResponse.json();
      } catch (err) {
        console.warn(`Failed to fetch ${monster.name}:`, err);
        return null;
      }
    })
  );
  
  return monsters.filter(Boolean);
};

/**
 * Fetch details for a specific monster by its index.
 * @param {string} index - The monster's index (e.g., 'adult-black-dragon')
 * @returns {Promise<Object>} The monster details object.
 */
export const fetchMonsterDetails = async (index) => {
  const response = await fetch(`${BASE_URL}/api/monsters/${index}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch monster details: ${response.status}`);
  }
  return response.json();
};