import HttpClient from './utils/HttpClient';
import { CreditCardTotal } from '../types/CreditCard';

class CheckService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient('http://localhost:3001');
  }

  findTotal(safraId?: string): Promise<CreditCardTotal> {
    return this.httpClient.get(safraId
      ? `/financeiro/cartao/total?idSafra=${safraId}`
      : '/financeiro/cartao/total'
    );
  }
}

export default new CheckService();
