import HttpClient from './HttpClient';

export const api = new HttpClient(
  import.meta.env.VITE_ENVIRONMENT === 'cloud'
    ? 'http://10.101.20.220:3001'
    : 'http://localhost:3001',
);
