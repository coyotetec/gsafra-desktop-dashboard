import { Patrimonio } from '../types/Patrimonio';
import HttpClient from './utils/HttpClient';
import { PORT } from './utils/info';

class PatrimonioService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(`http://localhost:${PORT}`);
  }

  findPatrimonios(): Promise<Patrimonio[]> {
    return this.httpClient.get('/patrimonios');
  }
}

export default new PatrimonioService();
