import HttpClient from './utils/HttpClient';
import { Total } from '../types/Financial';
import { PORT } from './utils/info';

class CheckService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(`http://localhost:${PORT}`);
  }

  findPayableCheckTotal(safraId?: string): Promise<Total> {
    return this.httpClient.get(safraId
      ? `/financeiro/cheque/pagar/total?idSafra=${safraId}`
      : '/financeiro/cheque/pagar/total'
    );
  }

  findReceivableCheckTotal(safraId?: string): Promise<Total> {
    return this.httpClient.get(safraId
      ? `/financeiro/cheque/receber/total?idSafra=${safraId}`
      : '/financeiro/cheque/receber/total'
    );
  }
}

export default new CheckService();
