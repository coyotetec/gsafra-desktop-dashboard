import { PlanoContas, PlanoContasTotal } from '../types/PlanoContas';
import HttpClient from './utils/HttpClient';

class PlanoContasService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient('http://localhost:3001');
  }

  findPlanoContas(type?: 'receita' | 'despesa', category?: 'sintetica' | 'analitica'): Promise<PlanoContas[]> {
    return this.httpClient.get(`/plano-conta?category=${category}&type=${type}`);
  }

  findPlanoContasTotal(codigo: string, startDate: string, endDate: string, safraId?: string): Promise<PlanoContasTotal[]> {
    return this.httpClient.get(safraId
      ? `/plano-conta/total/${codigo}?startDate=${startDate}&endDate=${endDate}&idSafra=${safraId}`
      : `/plano-conta/total/${codigo}?startDate=${startDate}&endDate=${endDate}`
    );
  }
}

export default new PlanoContasService();
