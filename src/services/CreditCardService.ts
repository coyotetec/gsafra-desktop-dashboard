import { api } from './utils/api';
import { CreditCardTotal } from '../types/CreditCard';

class CheckService {
  findTotal(startDate: string, endDate: string, safraId?: string): Promise<CreditCardTotal> {
    return api.get(safraId
      ? `/financeiro/cartao/total?startDate=${startDate}&endDate=${endDate}&idSafra=${safraId}`
      : `/financeiro/cartao/total?startDate=${startDate}&endDate=${endDate}`
    );
  }
}

export default new CheckService();
