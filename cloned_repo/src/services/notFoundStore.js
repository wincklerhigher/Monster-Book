const STORAGE_KEY = 'monsters_not_found';

export const getNotFoundList = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

export const addNotFoundMonster = (id) => {
  const list = getNotFoundList();
  if (!list.includes(id)) {
    list.push(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
};

export const removeFromNotFoundList = (id) => {
  const list = getNotFoundList();
  const updated = list.filter(m => m !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const clearNotFoundList = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const isMonsterNotFound = (id) => {
  return getNotFoundList().includes(id);
};