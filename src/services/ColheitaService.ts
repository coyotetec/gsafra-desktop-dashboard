import { api } from './utils/api';
import { ColheitaTotal, ColheitaDescontoTotal } from '../types/Colheita';

export type descontoType =
  | 'umidade'
  | 'impureza'
  | 'avariados'
  | 'quebrados'
  | 'esverdeados'
  | 'taxa_recepcao'
  | 'cota';

class ColheitaService {
  async findTotal(safraId: string) {
    const { data } = await api.get<ColheitaTotal>('/colheita/total', {
      params: {
        idSafra: safraId,
      },
    });

    return data;
  }

  async findDescontoTotal(safraId: string, desconto: descontoType) {
    const { data } = await api.get<ColheitaDescontoTotal>(
      '/colheita/desconto',
      {
        params: {
          idSafra: safraId,
          desconto,
        },
      },
    );

    return data;
  }
}

export default new ColheitaService();
