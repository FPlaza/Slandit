import axios from 'axios';
import { authService } from './authService';
import type { Profile, UpdateProfileDto } from '../types/profile.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const profileService = {
  
  async getProfileById(id: string): Promise<Profile> {
    const response = await axios.get<Profile>(`${API_URL}/profiles/${id}`);
    return response.data;
  },

  async updateMyProfile(profileData: UpdateProfileDto): Promise<Profile> {
    const token = authService.getToken();
    if (!token) throw new Error('No hay token. Inicia sesión.');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.patch<Profile>(`${API_URL}/profiles/me`, profileData, config);
    return response.data;
  },
};