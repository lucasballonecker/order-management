import axios, { AxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string;
  error?: string;
  detail?: string;
}

export const getErrorMessage = (error: unknown, fallbackMessage: string = 'Erro desconhecido'): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    

    if (axiosError.response?.data) {
      const data = axiosError.response.data;
      return data.message || data.error || data.detail || fallbackMessage;
    }
    
    return axiosError.message || fallbackMessage;
  }
  
  
  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }
  
  
  return fallbackMessage;
};
