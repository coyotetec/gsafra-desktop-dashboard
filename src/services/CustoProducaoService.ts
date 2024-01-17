import { api } from './utils/api';
import {
  CustoIndividual,
  CustoCategoria,
  CustoTalhao,
} from '../types/CustoProducao';

interface FindCustoCategoriaArgs {
  safraId: string | number;
  talhaoId?: number;
  startDate: string;
  endDate: string;
}

class CustoProducaoService {
  findCustoCategoria({
    safraId,
    talhaoId,
    startDate,
    endDate,
  }: FindCustoCategoriaArgs): Promise<CustoCategoria> {
    return api.get(
      `
      /custo-producao/categoria?idSafra=${safraId}&startDate=${startDate}&endDate=${endDate}
      ${talhaoId ? `&idTalhao=${talhaoId}` : ''}
    `
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/\s+/g, ''),
    );
  }

  findCustoTalhao({
    safraId,
    talhaoId,
    startDate,
    endDate,
  }: FindCustoCategoriaArgs): Promise<CustoTalhao> {
    return api.get(
      `
      /custo-producao/talhao?idSafra=${safraId}&startDate=${startDate}&endDate=${endDate}
      ${talhaoId ? `&idTalhao=${talhaoId}` : ''}
    `
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/\s+/g, ''),
    );
  }

  findCustoAtividade({
    safraId,
    talhaoId,
    startDate,
    endDate,
  }: FindCustoCategoriaArgs): Promise<CustoIndividual> {
    return api.get(
      `
      /atividade-agricola/custo-producao?idSafra=${safraId}&startDate=${startDate}&endDate=${endDate}
      ${talhaoId ? `&idTalhao=${talhaoId}` : ''}
    `
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/\s+/g, ''),
    );
  }

  findCustoManutencao({
    safraId,
    talhaoId,
    startDate,
    endDate,
  }: FindCustoCategoriaArgs): Promise<CustoIndividual> {
    return api.get(
      `
      /manutencao/custo-producao?idSafra=${safraId}&startDate=${startDate}&endDate=${endDate}
      ${talhaoId ? `&idTalhao=${talhaoId}` : ''}
    `
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/\s+/g, ''),
    );
  }

  findCustoAbastecimento({
    safraId,
    talhaoId,
    startDate,
    endDate,
  }: FindCustoCategoriaArgs): Promise<CustoIndividual> {
    return api.get(
      `
      /abastecimento/custo-producao?idSafra=${safraId}&startDate=${startDate}&endDate=${endDate}
      ${talhaoId ? `&idTalhao=${talhaoId}` : ''}
    `
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/\s+/g, ''),
    );
  }
}

export default new CustoProducaoService();
