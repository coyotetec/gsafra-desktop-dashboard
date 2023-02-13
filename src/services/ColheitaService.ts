import { api } from './utils/api';
import { ColheitaTotal, ColheitaDescontoTotal } from '../types/Colheita';

export type descontoType = 'umidade'
  | 'impureza'
  | 'avariados'
  | 'quebrados'
  | 'esverdeados'
  | 'taxa_recepcao'
  | 'cota';

class ColheitaService {
  findTotal(safraId: string): Promise<ColheitaTotal> {
    return api.get(`/colheita/total?idSafra=${safraId}`);
  }

  findDescontoTotal(safraId: string, desconto: descontoType): Promise<ColheitaDescontoTotal> {
    return api.get(`/colheita/desconto?idSafra=${safraId}&desconto=${desconto}`);
  }
}

export default new ColheitaService();
