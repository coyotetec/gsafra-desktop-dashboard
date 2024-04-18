import { api } from './utils/api';
import {
  DetailsData,
  FuelReviewData,
  MonthlyReviewData,
  PatrimonyReviewData,
} from '../types/Abastecimento';

interface FindReviewArgs {
  startDate: string;
  endDate: string;
  idPatrimonio?: string;
  idProdutoAlmoxarifado?: string;
  idAlmoxarifado?: string;
  idTipoPatrimonio?: string;
  custo: string;
}

class AbastecimentoService {
  async findMonthlyReview({
    custo,
    startDate,
    endDate,
    idPatrimonio,
    idProdutoAlmoxarifado,
    idAlmoxarifado,
    idTipoPatrimonio,
  }: FindReviewArgs) {
    const { data } = await api.get<MonthlyReviewData>(
      '/abastecimento/resumo-mensal',
      {
        params: {
          custo,
          startDate,
          endDate,
          idPatrimonio,
          idProdutoAlmoxarifado,
          idAlmoxarifado,
          idTipoPatrimonio,
        },
      },
    );

    return data;
  }

  async findDetails({
    custo,
    startDate,
    endDate,
    idPatrimonio,
    idProdutoAlmoxarifado,
    idAlmoxarifado,
    idTipoPatrimonio,
  }: FindReviewArgs) {
    const { data } = await api.get<DetailsData[]>('/abastecimento/detalhes', {
      params: {
        custo,
        startDate,
        endDate,
        idPatrimonio,
        idProdutoAlmoxarifado,
        idAlmoxarifado,
        idTipoPatrimonio,
      },
    });

    return data;
  }

  async findPatrimonyReview({
    custo,
    startDate,
    endDate,
    idPatrimonio,
    idProdutoAlmoxarifado,
    idAlmoxarifado,
  }: FindReviewArgs) {
    const { data } = await api.get<PatrimonyReviewData>(
      '/abastecimento/resumo-patrimonio',
      {
        params: {
          custo,
          startDate,
          endDate,
          idPatrimonio,
          idProdutoAlmoxarifado,
          idAlmoxarifado,
        },
      },
    );

    return data;
  }

  async findFuelReview({
    custo,
    startDate,
    endDate,
    idPatrimonio,
    idAlmoxarifado,
    idTipoPatrimonio,
  }: FindReviewArgs) {
    const { data } = await api.get<FuelReviewData>(
      '/abastecimento/resumo-combustivel',
      {
        params: {
          custo,
          startDate,
          endDate,
          idPatrimonio,
          idAlmoxarifado,
          idTipoPatrimonio,
        },
      },
    );

    return data;
  }
}

export default new AbastecimentoService();
