import axios from 'axios';
import { authService } from './authService';
import type { Post, CreatePostDto } from '../types/post.types';

const API_URL = 'http://localhost:3000/posts';

export const postService = {
  async createPost(postData: CreatePostDto): Promise<Post> {
    const token = authService.getToken();
    if (!token) throw new Error('No hay token. Inicia sesión.');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post<Post>(API_URL, postData, config);
    return response.data;
  },

  async getPostById(id: string): Promise<Post> {
    const response = await axios.get<Post>(`${API_URL}/${id}`);
    return response.data;
  },
};