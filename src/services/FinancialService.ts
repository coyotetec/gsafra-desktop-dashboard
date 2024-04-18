import { api } from './utils/api';
import { CashFlow, Total } from '../types/Financial';

class FinancialService {
  async findPayableTotal(
    startDate: string,
    endDate: string,
    safraId?: string,
    status?: string,
  ) {
    const { data } = await api.get<Total>('/financeiro/pagar/total', {
      params: {
        startDate,
        endDate,
        status,
        idSafra: safraId,
      },
    });

    return data;
  }

  async findReceivableTotal(
    startDate: string,
    endDate: string,
    safraId?: string,
    status?: string,
  ) {
    const { data } = await api.get<Total>('/financeiro/receber/total', {
      params: {
        startDate,
        endDate,
        status,
        idSafra: safraId,
      },
    });

    return data;
  }

  async findCashFlow(
    startDate: string,
    endDate: string,
    safraId?: string,
    status?: string,
  ) {
    const { data } = await api.get<CashFlow>('/financeiro/fluxo-caixa', {
      params: {
        startDate,
        endDate,
        status,
        idSafra: safraId,
      },
    });

    return data;
  }
}

export default new FinancialService();
