import HttpClient from './utils/HttpClient';
import { CashFlow, Total } from '../types/Financial';
import { PORT } from './utils/info';

class FinancialService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(`http://localhost:${PORT}`);
  }

  findPayableTotal(startDate: string, endDate: string, safraId?: string): Promise<Total> {
    return this.httpClient.get(safraId
      ? `/financeiro/pagar/total?startDate=${startDate}&endDate=${endDate}&idSafra=${safraId}`
      : `/financeiro/pagar/total?startDate=${startDate}&endDate=${endDate}`
    );
  }

  findReceivableTotal(startDate: string, endDate: string, safraId?: string): Promise<Total> {
    return this.httpClient.get(safraId
      ? `/financeiro/receber/total?startDate=${startDate}&endDate=${endDate}&idSafra=${safraId}`
      : `/financeiro/receber/total?startDate=${startDate}&endDate=${endDate}`
    );
  }

  findCashFlow(startDate: string, endDate: string, safraId?: string): Promise<CashFlow> {
    return this.httpClient.get(safraId
      ? `/financeiro/fluxo-caixa?startDate=${startDate}&endDate=${endDate}&idSafra=${safraId}`
      : `/financeiro/fluxo-caixa?startDate=${startDate}&endDate=${endDate}`
    );
  }
}

export default new FinancialService();
