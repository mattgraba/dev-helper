import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ token, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('dev-helper-token');
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/">Dev Helper AI</Link>
      </div>
      <div className="space-x-4">
        {!token ? (
          <>
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/login" className="hover:underline">Login</Link>
          </>
        ) : (
          <>
            <Link to="/analyze" className="hover:underline">Analyze</Link>
            <Link to="/history" className="hover:underline">History</Link>
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
