import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/Login';
import HistoryPage from './pages/History';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';

function App() {
  const [token, setToken] = useState(localStorage.getItem('dev-helper-token'));

  useEffect(() => {
    if (token) localStorage.setItem('dev-helper-token', token);
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    // Optionally navigate or fetch initial data
  };

  return (
    <Router>
      {/* Optional Navbar component here */}

      <Routes>
        <Route
          path="/"
          element={
            token ? <Navigate to="/history" /> : <Navigate to="/login" />
          }
        />

        <Route path="/login" element={<LoginPage onLogin={setToken} />} />

        <Route
          path="/history"
          element={token ? <HistoryPage /> : <Navigate to="/login" />}
        />

        {/* Catch-all fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
