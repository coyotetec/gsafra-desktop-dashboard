import { Talhao } from '../types/Talhao';
import HttpClient from './utils/HttpClient';
import { PORT } from './utils/info';

class TalhaoService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(`http://localhost:${PORT}`);
  }

  findTalhoes(idSafras: string): Promise<Talhao[]> {
    return this.httpClient.get(`/talhoes/${idSafras}`);
  }
}

export default new TalhaoService();
