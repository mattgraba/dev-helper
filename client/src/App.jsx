import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import HistoryPage from './pages/History';
import NotFound from './pages/NotFound';
import AnalyzePage from './pages/Analyze';
import AboutPage from './pages/About';
import HomePage from './pages/Home';

import PrivateRoute from './utils/privateRoute';

function App() {
  const [token, setToken] = useState(localStorage.getItem('dev-helper-token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('dev-helper-token', token);
    } else {
      localStorage.removeItem('dev-helper-token');
    }
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        {/* Auth pages without layout */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage onRegister={handleLogin} />} />

        {/* All other pages with layout */}
        <Route
          path="/*"
          element={
            <Layout token={token} onLogout={handleLogout}>
              <Routes>
                {/* Home page with Hero, Features, About */}
                <Route path="/" element={<HomePage />} />

                {/* CLI Usage page */}
                <Route path="/about" element={<AboutPage />} />

                {/* Protected Routes */}
                <Route
                  path="/analyze"
                  element={
                    <PrivateRoute token={token}>
                      <AnalyzePage />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/history"
                  element={
                    <PrivateRoute token={token}>
                      <HistoryPage />
                    </PrivateRoute>
                  }
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
