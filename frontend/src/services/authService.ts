import axios from 'axios';

const API_URL = 'http://localhost:3000';

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
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};