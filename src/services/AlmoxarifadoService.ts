import { Almoxarifado } from '../types/Almoxarifado';
import HttpClient from './utils/HttpClient';
import { PORT } from './utils/info';

class AlmoxarifadoService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(`http://localhost:${PORT}`);
  }

  findAlmoxarifados(): Promise<Almoxarifado[]> {
    return this.httpClient.get('/almoxarifados');
  }
}

export default new AlmoxarifadoService();
