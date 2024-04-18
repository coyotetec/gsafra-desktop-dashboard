import { api } from './utils/api';
import { Total } from '../types/Financial';

class CheckService {
  async findPayableCheckTotal(
    startDate: string,
    endDate: string,
    safraId?: string,
  ) {
    const { data } = await api.get<Total>('/financeiro/cheque/pagar/total', {
      params: {
        startDate,
        endDate,
        idSafra: safraId,
      },
    });

    return data;
  }

  async findReceivableCheckTotal(
    startDate: string,
    endDate: string,
    safraId?: string,
  ) {
    const { data } = await api.get<Total>('/financeiro/cheque/receber/total', {
      params: {
        startDate,
        endDate,
        idSafra: safraId,
      },
    });

    return data;
  }
}

export default new CheckService();
