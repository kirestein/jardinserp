import axios from 'axios';
import { AuthResponse, LoginData, RegisterData, Cargo, Funcionario } from '../types';

// Configuração da URL base da API
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Em produção, usa a mesma origem
  : 'http://localhost:3001/api';  // Em desenvolvimento, usa localhost

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Serviços de autenticação
export const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<{ message: string; userId: number }> => {
    const response = await api.post('/register', data);
    return response.data;
  },
};

// Serviços de cargos
export const cargoService = {
  getAll: async (): Promise<Cargo[]> => {
    const response = await api.get('/cargos');
    return response.data;
  },

  create: async (data: Omit<Cargo, 'id' | 'created_at'>): Promise<{ message: string; cargoId: number }> => {
    const response = await api.post('/cargos', data);
    return response.data;
  },

  update: async (id: number, data: Omit<Cargo, 'id' | 'created_at'>): Promise<{ message: string }> => {
    const response = await api.put(`/cargos/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/cargos/${id}`);
    return response.data;
  },
};

// Serviços de funcionários
export const funcionarioService = {
  getAll: async (): Promise<Funcionario[]> => {
    const response = await api.get('/funcionarios');
    return response.data;
  },

  getById: async (id: number): Promise<Funcionario> => {
    const response = await api.get(`/funcionarios/${id}`);
    return response.data;
  },

  create: async (data: FormData): Promise<{ message: string; funcionarioId: number }> => {
    const response = await api.post('/funcionarios', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: number, data: FormData): Promise<{ message: string }> => {
    const response = await api.put(`/funcionarios/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/funcionarios/${id}`);
    return response.data;
  },
};

export default api;