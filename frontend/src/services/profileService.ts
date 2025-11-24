import axios from 'axios';
import { authService } from './authService';
import type { Profile, UpdateProfileDto } from '../types/profile.types';

const API_URL = 'http://localhost:3000/profiles';

export const profileService = {
  
  async getProfileById(id: string): Promise<Profile> {
    const response = await axios.get<Profile>(`${API_URL}/${id}`);
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

    const response = await axios.patch<Profile>(`${API_URL}/me`, profileData, config);
    return response.data;
  },
};