import { api } from './utils/api';
import { CashFlow, Total } from '../types/Financial';

class FinancialService {
  findPayableTotal(startDate: string, endDate: string, safraId?: string): Promise<Total> {
    return api.get(safraId
      ? `/financeiro/pagar/total?startDate=${startDate}&endDate=${endDate}&idSafra=${safraId}`
      : `/financeiro/pagar/total?startDate=${startDate}&endDate=${endDate}`
    );
  }

  findReceivableTotal(startDate: string, endDate: string, safraId?: string): Promise<Total> {
    return api.get(safraId
      ? `/financeiro/receber/total?startDate=${startDate}&endDate=${endDate}&idSafra=${safraId}`
      : `/financeiro/receber/total?startDate=${startDate}&endDate=${endDate}`
    );
  }

  findCashFlow(startDate: string, endDate: string, safraId?: string): Promise<CashFlow> {
    return api.get(safraId
      ? `/financeiro/fluxo-caixa?startDate=${startDate}&endDate=${endDate}&idSafra=${safraId}`
      : `/financeiro/fluxo-caixa?startDate=${startDate}&endDate=${endDate}`
    );
  }
}

export default new FinancialService();
