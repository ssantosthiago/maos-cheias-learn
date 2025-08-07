import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'superadmin' | 'professor' | 'aluno';
  allowedRoles?: Array<'superadmin' | 'professor' | 'aluno'>;
}

const ProtectedRoute = ({ children, requiredRole, allowedRoles }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
        return;
      }

      if (!profile) {
        navigate('/');
        return;
      }

      // Check specific role requirement
      if (requiredRole && profile.role !== requiredRole) {
        navigate('/');
        return;
      }

      // Check if user role is in allowed roles
      if (allowedRoles && !allowedRoles.includes(profile.role as any)) {
        navigate('/');
        return;
      }
    }
  }, [user, profile, loading, navigate, requiredRole, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  if (requiredRole && profile.role !== requiredRole) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role as any)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;