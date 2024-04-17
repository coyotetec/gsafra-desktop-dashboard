import { api } from './utils/api';
import { Contrato, Romaneio } from '../types/Contrato';

interface FindRomaneiosArgs {
  contratoId: number;
  startDate?: string;
  endDate?: string;
}

class ContratoService {
  async findContratos(safraId: number) {
    const { data } = await api.get<Contrato[]>('/contrato', {
      params: {
        idSafra: safraId,
      },
    });

    return data;
  }

  async findRomaneios({ contratoId, startDate, endDate }: FindRomaneiosArgs) {
    const { data } = await api.get<Romaneio[]>(
      `/contrato/${contratoId}/romaneios`,
      {
        params: {
          startDate,
          endDate,
        },
      },
    );

    return data;
  }
}

export default new ContratoService();
