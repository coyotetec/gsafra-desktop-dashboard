import { api } from './utils/api';
import { Total } from '../types/Financial';

class CheckService {
  findPayableCheckTotal(startDate: string, endDate: string, safraId?: string): Promise<Total> {
    return api.get(safraId
      ? `/financeiro/cheque/pagar/total?startDate=${startDate}&endDate=${endDate}&idSafra=${safraId}`
      : `/financeiro/cheque/pagar/total?startDate=${startDate}&endDate=${endDate}`
    );
  }

  findReceivableCheckTotal(startDate: string, endDate: string, safraId?: string): Promise<Total> {
    return api.get(safraId
      ? `/financeiro/cheque/receber/total?startDate=${startDate}&endDate=${endDate}&idSafra=${safraId}`
      : `/financeiro/cheque/receber/total?startDate=${startDate}&endDate=${endDate}`
    );
  }
}

export default new CheckService();
