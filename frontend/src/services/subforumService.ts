import axios from 'axios';
import { authService } from './authService';
import type { Subforum, CreateSubforumDto } from '../types/subforum.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const subforumService = {
  async createSubforum(subforumData: CreateSubforumDto): Promise<Subforum> {
    const token = authService.getToken();
    if (!token) throw new Error('No hay token. Inicia sesión.');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post<Subforum>(`${API_URL}/subforums`, subforumData, config);
    return response.data;
  },

  async getSubforumById(id: string): Promise<Subforum> {
    const response = await axios.get<Subforum>(`${API_URL}/subforums/${id}`);
    return response.data;
  },

  async joinSubforum(subforumId: string): Promise<{ message: string }> {
    const token = authService.getToken();
    if (!token) throw new Error('No hay token');

    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const response = await axios.post<{ message: string }>(
      `${API_URL}/subforums/${subforumId}/join`, 
      {}, 
      config
    );
    
    return response.data;
  },

  async leaveSubforum(subforumId: string): Promise<{ message: string }> {
    const token = authService.getToken();
    if (!token) throw new Error('No hay token');

    const config = { headers: { Authorization: `Bearer ${token}` } };

    const response = await axios.post<{ message: string }>(
      `${API_URL}/subforums/${subforumId}/leave`, 
      {}, 
      config
    );
    
    return response.data;
  }
};