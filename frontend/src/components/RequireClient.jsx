import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireClient({ children }) {
  const { client, clientProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading…
      </div>
    );
  }

  if (!client) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Signed in but no DB client record yet → force the one-time linking step.
  // /verify-email is exempt so users can verify their email before linking.
  if (clientProfile === null && location.pathname !== '/verify-email') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
