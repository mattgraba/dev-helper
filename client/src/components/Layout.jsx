import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

export default function Layout({ children, token, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('dev-helper-token');
    onLogout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: 'white' }}>
      {/* Navigation */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgb(39, 39, 42)',
        }}
      >
        <div
          style={{
            width: '960px',
            maxWidth: '100%',
            margin: '0 auto',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              fontFamily: 'Inter Variable, Inter, sans-serif',
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'rgb(255, 255, 255)',
              textDecoration: 'none',
            }}
          >
            Dev Helper
          </Link>

          {/* Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link
              to="/"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                color: isActive('/') ? 'rgb(255, 255, 255)' : 'rgb(161, 161, 170)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseOver={(e) => {
                if (!isActive('/')) e.target.style.color = 'rgb(255, 255, 255)';
              }}
              onMouseOut={(e) => {
                if (!isActive('/')) e.target.style.color = 'rgb(161, 161, 170)';
              }}
            >
              Home
            </Link>

            <Link
              to="/about"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                color: isActive('/about') ? 'rgb(255, 255, 255)' : 'rgb(161, 161, 170)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseOver={(e) => {
                if (!isActive('/about')) e.target.style.color = 'rgb(255, 255, 255)';
              }}
              onMouseOut={(e) => {
                if (!isActive('/about')) e.target.style.color = 'rgb(161, 161, 170)';
              }}
            >
              CLI
            </Link>

            <Link
              to="/analyze"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                color: isActive('/analyze') ? 'rgb(255, 255, 255)' : 'rgb(161, 161, 170)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseOver={(e) => {
                if (!isActive('/analyze')) e.target.style.color = 'rgb(255, 255, 255)';
              }}
              onMouseOut={(e) => {
                if (!isActive('/analyze')) e.target.style.color = 'rgb(161, 161, 170)';
              }}
            >
              Analyze
            </Link>

            <Link
              to="/history"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                color: isActive('/history') ? 'rgb(255, 255, 255)' : 'rgb(161, 161, 170)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseOver={(e) => {
                if (!isActive('/history')) e.target.style.color = 'rgb(255, 255, 255)';
              }}
              onMouseOut={(e) => {
                if (!isActive('/history')) e.target.style.color = 'rgb(161, 161, 170)';
              }}
            >
              History
            </Link>

            {/* Auth Section */}
            {token ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '16px', paddingLeft: '16px', borderLeft: '1px solid rgb(63, 63, 70)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgb(161, 161, 170)' }}>
                  <User style={{ width: 14, height: 14 }} />
                  <span>Logged in</span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'rgb(161, 161, 170)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = 'rgb(255, 255, 255)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = 'rgb(161, 161, 170)';
                  }}
                >
                  <LogOut style={{ width: 14, height: 14 }} />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                style={{
                  marginLeft: '16px',
                  paddingLeft: '16px',
                  borderLeft: '1px solid rgb(63, 63, 70)',
                  padding: '8px 16px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: 'rgb(25, 25, 25)',
                  color: 'white',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  display: 'inline-block',
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = 'black';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'rgb(25, 25, 25)';
                  e.target.style.color = 'white';
                }}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ minHeight: 'calc(100vh - 64px)' }}>
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{
          marginTop: '120px',
          borderTop: '1px solid rgb(39, 39, 42)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <div
          style={{
            width: '960px',
            maxWidth: '100%',
            margin: '0 auto',
            padding: '40px 20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                color: 'rgb(119, 119, 119)',
                margin: 0,
              }}
            >
              2026 Dev Helper CLI. Built by{' '}
              <a
                href="https://mattgraba.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'rgb(168, 85, 247)',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
                onMouseOver={(e) => {
                  e.target.style.textDecoration = 'underline';
                }}
                onMouseOut={(e) => {
                  e.target.style.textDecoration = 'none';
                }}
              >
                Matt Graba
              </a>
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href="https://github.com/mattgraba/dev-helper"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: 'rgb(25, 25, 25)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = 'black';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'rgb(25, 25, 25)';
                  e.target.style.color = 'white';
                }}
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
