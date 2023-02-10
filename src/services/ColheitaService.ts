import { ColheitaTotal, ColheitaDescontoTotal } from '../types/Colheita';
import HttpClient from './utils/HttpClient';
import { PORT } from './utils/info';

export type descontoType = 'umidade'
  | 'impureza'
  | 'avariados'
  | 'quebrados'
  | 'esverdeados'
  | 'taxa_recepcao'
  | 'cota';

class ColheitaService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(`http://localhost:${PORT}`);
  }

  findTotal(safraId: string): Promise<ColheitaTotal> {
    return this.httpClient.get(`/colheita/total?idSafra=${safraId}`);
  }

  findDescontoTotal(safraId: string, desconto: descontoType): Promise<ColheitaDescontoTotal> {
    return this.httpClient.get(`/colheita/desconto?idSafra=${safraId}&desconto=${desconto}`);
  }
}

export default new ColheitaService();
