import { MovimentoContas } from '../types/MovimentoContas';
import HttpClient from './utils/HttpClient';
import { PORT } from './utils/info';

class MovimentoContaService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(`http://localhost:${PORT}`);
  }

  findMovimentoContas(codigo: string, startDate: string, endDate: string, safraId?: string): Promise<MovimentoContas[]> {
    return this.httpClient.get(safraId
      ? `/movimento-conta/${codigo}?startDate=${startDate}&endDate=${endDate}&idSafra=${safraId}`
      : `/movimento-conta/${codigo}?startDate=${startDate}&endDate=${endDate}`);
  }
}

export default new MovimentoContaService();
