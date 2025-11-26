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

  async getPostsBySubforum(subforumId: string): Promise<Post[]> {
    const response = await axios.get<Post[]>(`${API_URL}/posts/subforum/${subforumId}`);
    return response.data;
  },

  async getPostsByUser(userId: string): Promise<Post[]> {
    const response = await axios.get<Post[]>(`${API_URL}/posts/user/${userId}`);
    return response.data;
  },

  async getRecentPosts(): Promise<Post[]> {
    const response = await axios.get<Post[]>(`${API_URL}/posts/recent`);
    return response.data;
  },

  async deletePost(postId: string): Promise<{ message: string }> {
    const token = authService.getToken();
    if (!token) throw new Error('No hay token. No tienes permiso para eliminar.');

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    // Usamos axios.delete
    const response = await axios.delete<{ message: string }>(
      `${API_URL}/posts/${postId}`, 
      config
    );
    
    return response.data;
  },

  async getMyFeed(): Promise<Post[]> {
    const token = authService.getToken();
    if (!token) return []; 

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const response = await axios.get<Post[]>(`${API_URL}/posts/feed`, config);
    return response.data;
  },

  async getHotPosts(): Promise<Post[]> {
    const response = await axios.get<Post[]>(`${API_URL}/posts/hot`);
    return response.data;
  },
};