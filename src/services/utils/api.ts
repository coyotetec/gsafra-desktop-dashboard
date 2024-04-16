import HttpClient from './HttpClient';

export const api = new HttpClient(
  import.meta.env.VITE_ENVIRONMENT === 'cloud'
    ? 'http://node179752-dbgsafra.nordeste-idc.saveincloud.net'
    : 'http://localhost:3001',
);
