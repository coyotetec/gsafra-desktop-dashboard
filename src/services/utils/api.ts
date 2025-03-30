import axios from 'axios';

// export const api = axios.create({
//   baseURL:
//     import.meta.env.VITE_ENVIRONMENT === 'cloud'
//       ? 'https://api.dashboard.gsafra.com'
//       : 'http://localhost:3001',
// });
export const api = axios.create({
  baseURL:
    import.meta.env.VITE_ENVIRONMENT === 'cloud'
      ? 'https://92.246.130.170'
      : 'http://localhost:3001',
});
