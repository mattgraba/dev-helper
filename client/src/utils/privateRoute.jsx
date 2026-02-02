import { Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoute({ token, children }) {
  const location = useLocation();

  if (!token) {
    // Save the location they were trying to access
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
