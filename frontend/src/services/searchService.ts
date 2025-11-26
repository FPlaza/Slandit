import axios from 'axios';
import type { SearchResults } from '../types/search.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const searchService = {
  async search(query: string): Promise<SearchResults> {
    const response = await axios.get<SearchResults>(`${API_URL}/search`, {
      params: { q: query } // Axios convierte esto en ?q=valor
    });
    
    return response.data;
  }
};