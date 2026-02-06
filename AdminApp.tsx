import React from 'react';
import { useAuth } from './hooks/useAuth';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminPanel } from './components/admin/AdminPanel';

export const AdminApp: React.FC = () => {
  const { session, loading, signIn, signOut } = useAuth();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center max-w-md mx-auto"
        style={{ backgroundColor: '#1A1A1A' }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: '4px solid #333333',
            borderTop: '4px solid #F97316',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin onSignIn={signIn} loading={false} />;
  }

  return <AdminPanel onSignOut={signOut} />;
};
