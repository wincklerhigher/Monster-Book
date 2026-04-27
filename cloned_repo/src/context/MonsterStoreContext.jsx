import { createContext, useContext, useState } from 'react';

const MonsterStoreContext = createContext({
  monsters: [],
  page: 1,
  totalPages: 1,
  setMonsters: () => {},
  setPage: () => {},
  setTotalPages: () => {},
});

export const MonsterStoreProvider = ({ children }) => {
  const [monsters, setMonsters] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  return (
    <MonsterStoreContext.Provider value={{ monsters, page, totalPages, setMonsters, setPage, setTotalPages }}>
      {children}
    </MonsterStoreContext.Provider>
  );
};

export const useMonsterStore = () => useContext(MonsterStoreContext);