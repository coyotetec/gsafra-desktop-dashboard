import { Combustivel } from '../types/ProdutoAlmoxarifado';
import HttpClient from './utils/HttpClient';
import { PORT } from './utils/info';

class ProdutoAlmoxarifadoService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(`http://localhost:${PORT}`);
  }

  findCombustiveis(): Promise<Combustivel[]> {
    return this.httpClient.get('/combustiveis');
  }
}

export default new ProdutoAlmoxarifadoService();
