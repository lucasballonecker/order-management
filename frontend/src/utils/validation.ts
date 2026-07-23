export interface ValidationErrors {
  email?: string;
  password?: string;
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

export const validateLoginForm = (email: string, password: string): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!email) {
    errors.email = 'Email é obrigatório';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Email inválido';
  }

  if (!password) {
    errors.password = 'Senha é obrigatória';
  } else if (password.length < 6) {
    errors.password = 'Senha deve ter pelo menos 6 caracteres';
  }

  return errors;
};


