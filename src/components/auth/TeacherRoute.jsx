import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isTrustedAdminEmail } from '../../lib/authApi';

export default function TeacherRoute() {
  const { profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium">Memeriksa akses admin...</p>
        </div>
      </div>
    );
  }

  const isAdminAccess =
    profile &&
    profile.role === 'teacher' &&
    (profile.is_admin === true || isTrustedAdminEmail(profile.email));

  if (!isAdminAccess) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
