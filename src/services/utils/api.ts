import HttpClient from './HttpClient';

export const api = new HttpClient(
  import.meta.env.VITE_ENVIRONMENT === 'cloud'
    ? 'https://api.dashboard.gsafra.com'
    : 'http://localhost:3001',
);
