import { api } from './utils/api';
import {
  PlanoContas,
  PlanoContasFinancial,
  PlanoContasTotal,
} from '../types/PlanoContas';

class PlanoContasService {
  async findPlanoContas(
    type?: 'receita' | 'despesa',
    category?: 'sintetica' | 'analitica',
  ) {
    const { data } = await api.get<PlanoContas[]>('/plano-conta', {
      params: {
        category,
        type,
      },
    });

    return data;
  }

  async findPlanoContasTotal(
    codigo: string,
    startDate: string,
    endDate: string,
    safraId?: string,
  ) {
    const { data } = await api.get<PlanoContasTotal[]>(
      `/plano-conta/total/${codigo}`,
      {
        params: {
          startDate,
          endDate,
          idSafra: safraId,
        },
      },
    );

    return data;
  }

  async findPlanoContasFinancial(
    options: string,
    showZeros: boolean,
    startDate: string,
    endDate: string,
    status?: string,
  ) {
    const { data } = await api.get<{
      total: number;
      data: PlanoContasFinancial[];
      eachMonthTotal: number[];
    }>('/plano-conta/financeiro', {
      params: {
        options,
        showZeros,
        startDate,
        endDate,
        status,
      },
    });

    return data;
  }
}

export default new PlanoContasService();
