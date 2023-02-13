import { api } from './utils/api';
import { PlanoContas, PlanoContasTotal } from '../types/PlanoContas';

class PlanoContasService {
  findPlanoContas(type?: 'receita' | 'despesa', category?: 'sintetica' | 'analitica'): Promise<PlanoContas[]> {
    return api.get(`/plano-conta?category=${category}&type=${type}`);
  }

  findPlanoContasTotal(codigo: string, startDate: string, endDate: string, safraId?: string): Promise<PlanoContasTotal[]> {
    return api.get(safraId
      ? `/plano-conta/total/${codigo}?startDate=${startDate}&endDate=${endDate}&idSafra=${safraId}`
      : `/plano-conta/total/${codigo}?startDate=${startDate}&endDate=${endDate}`
    );
  }
}

export default new PlanoContasService();
