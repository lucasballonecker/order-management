import { describe, it, expect } from 'vitest';
import { getErrorMessage } from '../../utils/errorHandler';
import { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const mockRequestConfig = {
  headers: new Headers(),
} as unknown as InternalAxiosRequestConfig;

describe('getErrorMessage', () => {
  it('deve extrair mensagem de um AxiosError com response', () => {
    const error = new AxiosError('Request failed');
    error.response = {
      data: { message: 'Email já cadastrado' },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: mockRequestConfig,
    };

    const result = getErrorMessage(error);

    expect(result).toBe('Email já cadastrado');
  });

  it('deve extrair campo "error" quando "message" não existe', () => {
    const error = new AxiosError('Request failed');
    error.response = {
      data: { error: 'Usuário não encontrado' },
      status: 404,
      statusText: 'Not Found',
      headers: {},
      config: mockRequestConfig,
    };

    const result = getErrorMessage(error);

    expect(result).toBe('Usuário não encontrado');
  });

  it('deve usar fallback quando AxiosError não tem response.data', () => {
    const error = new AxiosError('Network Error');
    const fallback = 'Erro de conexão';

    const result = getErrorMessage(error, fallback);

    expect(result).toBe('Network Error');
  });

  it('deve retornar mensagem de erro genérico', () => {
    const error = new Error('Algo deu errado');

    const result = getErrorMessage(error);

    expect(result).toBe('Algo deu errado');
  });

  it('deve usar fallback para erro desconhecido', () => {
    const result = getErrorMessage('string qualquer', 'Erro padrão');

    expect(result).toBe('Erro padrão');
  });

  it('deve usar fallback padrão quando nenhum é fornecido', () => {
    const result = getErrorMessage(null);

    expect(result).toBe('Erro desconhecido');
  });
});

