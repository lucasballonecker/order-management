import { describe, it, expect } from 'vitest';
import { validateLoginForm } from '../../utils/validation';

describe('validateLoginForm', () => {
  it('deve retornar erros quando email e senha estão vazios', () => {
    const errors = validateLoginForm('', '');

    expect(errors).toHaveProperty('email');
    expect(errors).toHaveProperty('password');
    expect(errors.email).toBe('Email é obrigatório');
    expect(errors.password).toBe('Senha é obrigatória');
  });

  it('deve retornar erro para email inválido', () => {
    const errors = validateLoginForm('invalido', 'senha123');

    expect(errors).toHaveProperty('email');
    expect(errors.email).toBe('Email inválido');
    expect(errors).not.toHaveProperty('password');
  });

  it('deve retornar erro para senha muito curta', () => {
    const errors = validateLoginForm('user@email.com', '123');

    expect(errors).toHaveProperty('password');
    expect(errors.password).toBe('Senha deve ter pelo menos 6 caracteres');
    expect(errors).not.toHaveProperty('email');
  });

  it('deve retornar objeto vazio para formulário válido', () => {
    const errors = validateLoginForm('user@email.com', 'senha123');

    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('deve aceitar email com domínio de múltiplos níveis', () => {
    const errors = validateLoginForm('user@email.com.br', 'senha123');

    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('deve aceitar email com subdomínio', () => {
    const errors = validateLoginForm('user@sub.domain.com', 'senha123');

    expect(Object.keys(errors)).toHaveLength(0);
  });
});

