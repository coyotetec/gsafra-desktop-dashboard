import { api } from './utils/api';
import { MovimentoContas } from '../types/MovimentoContas';

class MovimentoContaService {
  async findMovimentoContas(
    codigo: string,
    startDate: string,
    endDate: string,
    safraId?: string,
  ) {
    const { data } = await api.get<MovimentoContas[]>(
      `/movimento-conta/${codigo}`,
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

export default new MovimentoContaService();
