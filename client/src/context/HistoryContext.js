import { createContext, useContext, useState } from 'react';

const HistoryContext = createContext();

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <HistoryContext.Provider value={{ history, setHistory, loading, setLoading }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  return useContext(HistoryContext);
}
