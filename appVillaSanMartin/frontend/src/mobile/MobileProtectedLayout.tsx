import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MobileLayout } from './MobileLayout';

export function MobileProtectedLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <MobileLayout />;
}
