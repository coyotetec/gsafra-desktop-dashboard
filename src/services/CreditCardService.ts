import HttpClient from './utils/HttpClient';
import { CreditCardTotal } from '../types/CreditCard';
import { PORT } from './utils/info';

class CheckService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(`http://localhost:${PORT}`);
  }

  findTotal(startDate: string, endDate: string, safraId?: string): Promise<CreditCardTotal> {
    return this.httpClient.get(safraId
      ? `/financeiro/cartao/total?startDate=${startDate}&endDate=${endDate}&idSafra=${safraId}`
      : `/financeiro/cartao/total?startDate=${startDate}&endDate=${endDate}`
    );
  }
}

export default new CheckService();
