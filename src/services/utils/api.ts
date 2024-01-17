import HttpClient from './HttpClient';

export const api = new HttpClient(
  import.meta.env.VITE_ENVIRONMENT === 'cloud'
    ? 'http://10.100.52.87:3001'
    : 'http://localhost:3001',
);
