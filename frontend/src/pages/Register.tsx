import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { EMAIL_REGEX } from '../utils/validation';
import { getErrorMessage } from '../utils/errorHandler';

const INPUT_CLASS = "block w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors";

const clearForm = (
  setName: (v: string) => void,
  setEmail: (v: string) => void,
  setPassword: (v: string) => void,
  setConfirmPassword: (v: string) => void
) => {
  setName('');
  setEmail('');
  setPassword('');
  setConfirmPassword('');
};

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const setValidationError = (message: string) => {
    setError(message);
    return;
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name || !email || !password || !confirmPassword) {
      return setValidationError('Por favor, preencha todos os campos');
    }

    if (!EMAIL_REGEX.test(email)) {
      return setValidationError('Por favor, insira um email válido (ex: usuario@dominio.com)');
    }

    if (password !== confirmPassword) {
      return setValidationError('As senhas não coincidem');
    }

    setLoading(true);

    try {
      await api.post('/users', {
        name,
        email,
        password,
        role: 'USER'
      });

      setSuccess(true);
      clearForm(setName, setEmail, setPassword, setConfirmPassword);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Erro ao registrar usuário'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="max-w-md w-full bg-white shadow-sm border border-slate-100 rounded-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Criar Conta
          </h1>
          <p className="text-slate-600">Junte-se ao Order Management</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
            Cadastro realizado com sucesso! Você já pode fazer login.
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              Nome Completo
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={INPUT_CLASS}
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={INPUT_CLASS}
              placeholder="seu@email.com"
              required
            />
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
              className={INPUT_CLASS}
              placeholder="Sua senha (mín. 6 caracteres)"
              minLength={6}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={INPUT_CLASS}
              placeholder="Confirme sua senha"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Já tem conta?
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

