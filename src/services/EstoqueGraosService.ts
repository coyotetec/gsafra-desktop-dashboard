import { api } from './utils/api';
import {
  EstoqueGraosProdutorTotal,
  EstoqueGraosTotal,
} from '../types/EstoqueGraos';

interface EstoqueGraosArgs {
  culturaId: number;
  startDate?: string;
  endDate?: string;
  produtorId?: number;
  armazenamentoId?: number;
  safraId?: number;
}

class EstoqueGraosService {
  async findTotal({
    culturaId,
    startDate,
    endDate,
    produtorId,
    armazenamentoId,
    safraId,
  }: EstoqueGraosArgs) {
    const { data } = await api.get<EstoqueGraosTotal>('/estoque-graos/total', {
      params: {
        startDate,
        endDate,
        idCultura: culturaId,
        idProdutor: produtorId,
        idAmazenamento: armazenamentoId,
        idSafra: safraId,
      },
    });

    return data;
  }

  async findProducerTotal({
    culturaId,
    startDate,
    endDate,
    produtorId,
    armazenamentoId,
    safraId,
  }: EstoqueGraosArgs) {
    const { data } = await api.get<EstoqueGraosProdutorTotal>(
      '/estoque-graos/produtor',
      {
        params: {
          startDate,
          endDate,
          idCultura: culturaId,
          idProdutor: produtorId,
          idArmazenamento: armazenamentoId,
          idSafra: safraId,
        },
      },
    );

    return data;
  }
}

export default new EstoqueGraosService();
