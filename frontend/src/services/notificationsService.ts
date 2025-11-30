import axios from 'axios';
import { authService } from './authService';
import type { Notification } from '../types/notification.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const notificationService = {

  // GET /notifications (Mis notificaciones)
  async getMyNotifications(): Promise<Notification[]> {
    const token = authService.getToken();
    if (!token) return []; // Si no hay sesión, devolvemos vacío sin error

    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get<Notification[]>(`${API_URL}/notifications`, config);
    return response.data;
  },

  // GET /notifications/unread-count (Para la burbuja roja)
  async getUnreadCount(): Promise<{ count: number }> {
    const token = authService.getToken();
    if (!token) return { count: 0 };

    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get<{ count: number }>(`${API_URL}/notifications/unread-count`, config);
    return response.data;
  },

  // PATCH /notifications/:id/read (Marcar como leída)
  async markAsRead(id: string): Promise<Notification> {
    const token = authService.getToken();
    if (!token) throw new Error('No auth');

    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.patch<Notification>(`${API_URL}/notifications/${id}/read`, {}, config);
    return response.data;
  }
};