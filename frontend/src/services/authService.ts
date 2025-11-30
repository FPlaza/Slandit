import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface AuthResponse {
  accessToken: string;
  user: any;
}

function handleAuthSuccess(data: { accessToken: string; user: any }) {
  if (data.accessToken) {
    localStorage.setItem('token', data.accessToken);
  }
  if (data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  window.dispatchEvent(new Event("auth-changed"));

  return data;
}

export const authService = {
  async register(email: string, username: string, password: string) {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, {
      email,
      username,
      password,
    });

    return handleAuthSuccess(response.data);
  },

  async login(email: string, password: string) {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
      email,
      password,
    });

    return handleAuthSuccess(response.data);
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    window.dispatchEvent(new Event("auth-changed"));
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getUser() {
    const userRaw = localStorage.getItem('user');
    if (!userRaw) return null;
    try {
      const user = JSON.parse(userRaw);
      // Normalizar: asegurar que siempre haya `id` además de `_id`
      if (!user.id && (user._id || user.id === undefined)) {
        user.id = user._id || user.id;
      }
      return user;
    } catch (err) {
      console.error('Error parsing stored user', err);
      return null;
    }
  },
};
