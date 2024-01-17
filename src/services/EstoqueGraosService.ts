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
  findTotal({
    culturaId,
    startDate,
    endDate,
    produtorId,
    armazenamentoId,
    safraId,
  }: EstoqueGraosArgs): Promise<EstoqueGraosTotal> {
    return api.get(
      `/estoque-graos/total?idCultura=${culturaId}&startDate=${startDate}&endDate=${endDate}
    ${produtorId ? `&idProdutor=${produtorId}` : ''}
    ${armazenamentoId ? `&idArmazenamento=${armazenamentoId}` : ''}
    ${safraId ? `&idSafra=${safraId}` : ''}
  `
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/\s+/g, ''),
    );
  }

  findProducerTotal({
    culturaId,
    startDate,
    endDate,
    produtorId,
    armazenamentoId,
    safraId,
  }: EstoqueGraosArgs): Promise<EstoqueGraosProdutorTotal> {
    return api.get(
      `/estoque-graos/produtor?idCultura=${culturaId}&startDate=${startDate}&endDate=${endDate}
    ${produtorId ? `&idProdutor=${produtorId}` : ''}
    ${armazenamentoId ? `&idArmazenamento=${armazenamentoId}` : ''}
    ${safraId ? `&idSafra=${safraId}` : ''}
  `
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/\s+/g, ''),
    );
  }
}

export default new EstoqueGraosService();
