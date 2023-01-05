import HttpClient from './utils/HttpClient';
import { CashFlow, Total } from '../types/Financial';
import { PORT } from './utils/info';

class FinancialService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(`http://localhost:${PORT}`);
  }

  findPayableTotal(safraId?: string): Promise<Total> {
    return this.httpClient.get(safraId
      ? `/financeiro/pagar/total?idSafra=${safraId}`
      : '/financeiro/pagar/total'
    );
  }

  findReceivableTotal(safraId?: string): Promise<Total> {
    return this.httpClient.get(safraId
      ? `/financeiro/receber/total?idSafra=${safraId}`
      : '/financeiro/receber/total'
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
