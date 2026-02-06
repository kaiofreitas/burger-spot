import React, { useState } from 'react';

interface AdminLoginProps {
  onSignIn: (email: string, password: string) => Promise<{ error: any }>;
  loading: boolean;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSignIn, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const { error: signInError } = await onSignIn(email, password);

    if (signInError) {
      setError(signInError.message || 'Erro ao fazer login');
    }
    setSubmitting(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: '#1A1A1A' }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl p-8"
        style={{ backgroundColor: '#242424', border: '1px solid #2E2E2E' }}
      >
        <h1
          className="text-2xl font-bold text-center mb-8"
          style={{ color: '#F97316', fontFamily: 'Inter, sans-serif' }}
        >
          Admin Login
        </h1>

        {error && (
          <div
            className="mb-4 p-3 rounded-lg text-sm text-center"
            style={{ backgroundColor: '#2A2A2A', color: '#EF4444', border: '1px solid #333333' }}
          >
            {error}
          </div>
        )}

        <div className="mb-4">
          <label
            className="block text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: '#A3A3A3' }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
            style={{
              backgroundColor: '#2A2A2A',
              border: '1px solid #333333',
              color: '#F5F5F5',
            }}
            placeholder="admin@exemplo.com"
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: '#A3A3A3' }}
          >
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
            style={{
              backgroundColor: '#2A2A2A',
              border: '1px solid #333333',
              color: '#F5F5F5',
            }}
            placeholder="********"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || loading}
          className="w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-opacity"
          style={{
            backgroundColor: '#F97316',
            color: '#FFFFFF',
            opacity: submitting || loading ? 0.6 : 1,
          }}
        >
          {submitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};
