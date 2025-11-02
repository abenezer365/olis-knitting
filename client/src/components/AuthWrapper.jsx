import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '@/contexts/Context';

function AuthWrapper({ children }) {
  const { user, loading } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/unauthorized');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return children;
}

export default AuthWrapper;