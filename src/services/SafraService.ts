import { Safra } from '../types/Safra';
import HttpClient from './utils/HttpClient';

class SafraService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient('http://localhost:3001');
  }

  findSafras(): Promise<Safra[]> {
    return this.httpClient.get('/safras');
  }
}

export default new SafraService();
