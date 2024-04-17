import axios from 'axios';

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_ENVIRONMENT === 'cloud'
      ? 'http://node179752-dbgsafra.nordeste-idc.saveincloud.net'
      : 'http://localhost:3001',
});
