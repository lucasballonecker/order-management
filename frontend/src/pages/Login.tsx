import { useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api/api';
import { getErrorMessage } from '../utils/errorHandler';
import { validateLoginForm, type ValidationErrors } from '../utils/validation';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const from = location.state?.from?.pathname ?? '/products';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateLoginForm(email, password);
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      const { token } = response.data;

      login(token);

      navigate(from, { replace: true });
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Falha ao autenticar. Verifique suas credenciais.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="max-w-md w-full bg-white shadow-sm border border-slate-100 rounded-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Order Management
          </h1>
          <p className="text-slate-600">Entre na sua conta</p>
        </div>

        {error && <Alert type="error" message={error} />}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors ${
                validationErrors.email ? 'border-error-300' : 'border-slate-300'
              }`}
              placeholder="seu@email.com"
              required
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-error-600">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors ${
                validationErrors.password ? 'border-error-300' : 'border-slate-300'
              }`}
              placeholder="Sua senha"
              required
            />
            {validationErrors.password && (
              <p className="mt-1 text-sm text-error-600">{validationErrors.password}</p>
            )}
          </div>

          <Button type="submit" loading={loading} className="w-full">
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-600 text-sm">
            Não tem conta?
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium pl-1">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>

  );
};