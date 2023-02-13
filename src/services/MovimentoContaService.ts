import { api } from './utils/api';
import { MovimentoContas } from '../types/MovimentoContas';

class MovimentoContaService {
  findMovimentoContas(codigo: string, startDate: string, endDate: string, safraId?: string): Promise<MovimentoContas[]> {
    return api.get(safraId
      ? `/movimento-conta/${codigo}?startDate=${startDate}&endDate=${endDate}&idSafra=${safraId}`
      : `/movimento-conta/${codigo}?startDate=${startDate}&endDate=${endDate}`);
  }
}

export default new MovimentoContaService();
