import axios from 'axios';
import { authService } from './authService';
import type { Comment, CreateCommentDto } from '../types/comment.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const commentService = {

  async createComment(commentData: CreateCommentDto): Promise<Comment> {
    const token = authService.getToken();
    if (!token) throw new Error('No hay token. Inicia sesión para comentar.');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post<Comment>(`${API_URL}/comments`, commentData, config);
    return response.data;
  },

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    const response = await axios.get<Comment[]>(`${API_URL}/comments/post/${postId}`);
    return response.data;
  }
};