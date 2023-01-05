import HttpClient from './utils/HttpClient';
import { CreditCardTotal } from '../types/CreditCard';
import { PORT } from './utils/info';

class CheckService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(`http://localhost:${PORT}`);
  }

  findTotal(safraId?: string): Promise<CreditCardTotal> {
    return this.httpClient.get(safraId
      ? `/financeiro/cartao/total?idSafra=${safraId}`
      : '/financeiro/cartao/total'
    );
  }
}

export default new CheckService();
