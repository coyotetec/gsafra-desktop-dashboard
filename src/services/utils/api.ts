import axios from 'axios';
import HttpClient from './HttpClient';

export const api = new HttpClient(
  import.meta.env.VITE_ENVIRONMENT === 'cloud'
    ? 'http://localhost:3001'
    : 'http://localhost:3001',
);

export const axiosApi = axios.create({
  baseURL:
    import.meta.env.VITE_ENVIRONMENT === 'cloud'
      ? 'http://localhost:3001'
      : 'http://localhost:3001',
});
