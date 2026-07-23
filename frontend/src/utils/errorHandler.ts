import axios, { AxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string;
  error?: string;
  detail?: string;
}

const STATUS_MESSAGES: Record<number, string> = {
  400: 'Requisição inválida',
  401: 'Credenciais inválidas',
  403: 'Acesso negado',
  404: 'Recurso não encontrado',
  500: 'Erro interno do servidor',
};

export const getErrorMessage = (error: unknown, fallbackMessage = 'Erro desconhecido'): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response) {
      const { data, status } = axiosError.response;

      const serverMessage =
        data?.message ?? data?.error ?? data?.detail;

      if (serverMessage) return serverMessage;

      const statusMessage = STATUS_MESSAGES[status];
      if (statusMessage) return statusMessage;
    }

    return axiosError.message ?? fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message ?? fallbackMessage;
  }

  return fallbackMessage;
};

