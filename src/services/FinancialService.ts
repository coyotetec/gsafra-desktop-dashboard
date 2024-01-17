import { api } from './utils/api';
import { CashFlow, Total } from '../types/Financial';

class FinancialService {
  findPayableTotal(
    startDate: string,
    endDate: string,
    safraId?: string,
    status?: string,
  ): Promise<Total> {
    return api.get(
      safraId
        ? `/financeiro/pagar/total?startDate=${startDate}&endDate=${endDate}&idSafra=${safraId}${status ? `&status=${status}` : ''}`
        : `/financeiro/pagar/total?startDate=${startDate}&endDate=${endDate}${status ? `&status=${status}` : ''}`,
    );
  }

  findReceivableTotal(
    startDate: string,
    endDate: string,
    safraId?: string,
    status?: string,
  ): Promise<Total> {
    return api.get(
      safraId
        ? `/financeiro/receber/total?startDate=${startDate}&endDate=${endDate}&idSafra=${safraId}${status ? `&status=${status}` : ''}`
        : `/financeiro/receber/total?startDate=${startDate}&endDate=${endDate}${status ? `&status=${status}` : ''}`,
    );
  }

  findCashFlow(
    startDate: string,
    endDate: string,
    safraId?: string,
    status?: string,
  ): Promise<CashFlow> {
    return api.get(
      safraId
        ? `/financeiro/fluxo-caixa?startDate=${startDate}&endDate=${endDate}&idSafra=${safraId}${status ? `&status=${status}` : ''}`
        : `/financeiro/fluxo-caixa?startDate=${startDate}&endDate=${endDate}${status ? `&status=${status}` : ''}`,
    );
  }
}

export default new FinancialService();
