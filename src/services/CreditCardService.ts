import { api } from './utils/api';
import { CreditCardTotal } from '../types/CreditCard';

class CheckService {
  async findTotal(startDate: string, endDate: string, safraId?: string) {
    const { data } = await api.get<CreditCardTotal>(
      '/financeiro/cartao/total',
      {
        params: {
          startDate,
          endDate,
          idSafra: safraId,
        },
      },
    );

    return data;
  }
}

export default new CheckService();
