import axios from 'axios';
import { authService } from './authService';
import type { Post, CreatePostDto } from '../types/post.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const postService = {
  async createPost(postData: CreatePostDto): Promise<Post> {
    const token = authService.getToken();
    if (!token) throw new Error('No hay token. Inicia sesión.');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post<Post>(`${API_URL}/posts`, postData, config);
    return response.data;
  },

  async getPostById(id: string): Promise<Post> {
    const response = await axios.get<Post>(`${API_URL}/posts/${id}`);
    return response.data;
  },

  async toggleUpvote(postId: string): Promise<Post> {
    const token = authService.getToken();
    if (!token) throw new Error('Debes iniciar sesión para votar.');

    const config = { headers: { Authorization: `Bearer ${token}` } };
    // PATCH /posts/:id/upvote
    const response = await axios.patch<Post>(`${API_URL}/posts/${postId}/upvote`, {}, config);
    return response.data;
  },

  async toggleDownvote(postId: string): Promise<Post> {
    const token = authService.getToken();
    if (!token) throw new Error('Debes iniciar sesión para votar.');

    const config = { headers: { Authorization: `Bearer ${token}` } };
    // PATCH /posts/:id/downvote
    const response = await axios.patch<Post>(`${API_URL}/posts/${postId}/downvote`, {}, config);
    return response.data;
  },
};