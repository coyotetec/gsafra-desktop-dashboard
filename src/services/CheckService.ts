import HttpClient from './utils/HttpClient';
import { Total } from '../types/Financial';
import { PORT } from './utils/info';

class CheckService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(`http://localhost:${PORT}`);
  }

  findPayableCheckTotal(startDate: string, endDate: string, safraId?: string): Promise<Total> {
    return this.httpClient.get(safraId
      ? `/financeiro/cheque/pagar/total?startDate=${startDate}&endDate=${endDate}&idSafra=${safraId}`
      : `/financeiro/cheque/pagar/total?startDate=${startDate}&endDate=${endDate}`
    );
  }

  findReceivableCheckTotal(startDate: string, endDate: string, safraId?: string): Promise<Total> {
    return this.httpClient.get(safraId
      ? `/financeiro/cheque/receber/total?startDate=${startDate}&endDate=${endDate}&idSafra=${safraId}`
      : `/financeiro/cheque/receber/total?startDate=${startDate}&endDate=${endDate}`
    );
  }
}

export default new CheckService();
