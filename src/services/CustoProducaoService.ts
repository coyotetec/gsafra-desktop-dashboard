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
  async findCustoCategoria({
    safraId,
    talhaoId,
    startDate,
    endDate,
  }: FindCustoCategoriaArgs) {
    const { data } = await api.get<CustoCategoria>(
      '/custo-producao/categoria',
      {
        params: {
          startDate,
          endDate,
          idSafra: safraId,
          idTalhao: talhaoId,
        },
      },
    );

    return data;
  }

  async findCustoTalhao({
    safraId,
    talhaoId,
    startDate,
    endDate,
  }: FindCustoCategoriaArgs) {
    const { data } = await api.get<CustoTalhao>('/custo-producao/talhao', {
      params: {
        startDate,
        endDate,
        idSafra: safraId,
        idTalhao: talhaoId,
      },
    });

    return data;
  }

  async findCustoAtividade({
    safraId,
    talhaoId,
    startDate,
    endDate,
  }: FindCustoCategoriaArgs) {
    const { data } = await api.get<CustoIndividual>(
      '/atividade-agricola/custo-producao',
      {
        params: {
          startDate,
          endDate,
          idSafra: safraId,
          idTalhao: talhaoId,
        },
      },
    );

    return data;
  }

  async findCustoManutencao({
    safraId,
    talhaoId,
    startDate,
    endDate,
  }: FindCustoCategoriaArgs) {
    const { data } = await api.get<CustoIndividual>(
      '/manutencao/custo-producao',
      {
        params: {
          startDate,
          endDate,
          idSafra: safraId,
          idTalhao: talhaoId,
        },
      },
    );

    return data;
  }

  async findCustoAbastecimento({
    safraId,
    talhaoId,
    startDate,
    endDate,
  }: FindCustoCategoriaArgs) {
    const { data } = await api.get<CustoIndividual>(
      '/abastecimento/custo-producao',
      {
        params: {
          startDate,
          endDate,
          idSafra: safraId,
          idTalhao: talhaoId,
        },
      },
    );

    return data;
  }
}

export default new CustoProducaoService();
