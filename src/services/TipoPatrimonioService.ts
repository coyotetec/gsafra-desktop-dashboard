import { TipoPatrimonio } from '../types/TipoPatrimonio';
import HttpClient from './utils/HttpClient';
import { PORT } from './utils/info';

class TipoPatrimonioService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(`http://localhost:${PORT}`);
  }

  findTiposPatrimonio(): Promise<TipoPatrimonio[]> {
    return this.httpClient.get('/tipos-patrimonio');
  }
}

export default new TipoPatrimonioService();
