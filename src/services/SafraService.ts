import { Safra } from '../types/Safra';
import HttpClient from './utils/HttpClient';
import { PORT } from './utils/info';

class SafraService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(`http://localhost:${PORT}`);
  }

  findSafras(): Promise<Safra[]> {
    return this.httpClient.get('/safras');
  }
}

export default new SafraService();
