import axios from 'axios';
import { Ticket, Comment, User } from '@/types';

const api = axios.create({
  baseURL: '/api',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Ticket services
export const ticketService = {
  getAll: async (filters?: { status?: string; priority?: string }): Promise<Ticket[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    
    const response = await api.get(`/tickets?${params.toString()}`);
    return response.data;
  },
  
  getById: async (id: string): Promise<Ticket> => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },
  
  create: async (data: { title: string; description: string; email: string; priority: string }): Promise<Ticket> => {
    const response = await api.post('/tickets', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Ticket>): Promise<Ticket> => {
    const response = await api.put(`/tickets/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/tickets/${id}`);
  },
};

// Comment services
export const commentService = {
  getByTicket: async (ticketId: string): Promise<Comment[]> => {
    const response = await api.get(`/comments?ticketId=${ticketId}`);
    return response.data;
  },
  
  create: async (data: { ticketId: string; message: string }): Promise<Comment> => {
    const response = await api.post('/comments', data);
    return response.data;
  },
};

// Auth services
export const authService = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (data: { name: string; email: string; password: string; role: string }): Promise<User> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default api;

