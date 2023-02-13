import { api } from './utils/api';
import {
  DetailsData,
  FuelReviewData,
  MonthlyReviewData,
  PatrimonyReviewData
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
  findMonthlyReview({
    custo,
    startDate,
    endDate,
    idPatrimonio,
    idProdutoAlmoxarifado,
    idAlmoxarifado,
    idTipoPatrimonio,
  }: FindReviewArgs): Promise<MonthlyReviewData> {
    return api.get(`
      /abastecimento/resumo-mensal?custo=${custo}&startDate=${startDate}&endDate=${endDate}
      ${idPatrimonio ? `&idPatrimonio=${idPatrimonio}` : ''}
      ${idProdutoAlmoxarifado ? `&idProdutoAlmoxarifado=${idProdutoAlmoxarifado}` : ''}
      ${idAlmoxarifado ? `&idAlmoxarifado=${idAlmoxarifado}` : ''}
      ${idTipoPatrimonio ? `&idTipoPatrimonio=${idTipoPatrimonio}` : ''}
    `.replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g, ''));
  }

  findDetails({
    custo,
    startDate,
    endDate,
    idPatrimonio,
    idProdutoAlmoxarifado,
    idAlmoxarifado,
    idTipoPatrimonio,
  }: FindReviewArgs): Promise<DetailsData[]> {
    return api.get(`
      /abastecimento/detalhes?custo=${custo}&startDate=${startDate}&endDate=${endDate}
      ${idPatrimonio ? `&idPatrimonio=${idPatrimonio}` : ''}
      ${idProdutoAlmoxarifado ? `&idProdutoAlmoxarifado=${idProdutoAlmoxarifado}` : ''}
      ${idAlmoxarifado ? `&idAlmoxarifado=${idAlmoxarifado}` : ''}
      ${idTipoPatrimonio ? `&idTipoPatrimonio=${idTipoPatrimonio}` : ''}
    `.replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g, ''));
  }

  findPatrimonyReview({
    custo,
    startDate,
    endDate,
    idPatrimonio,
    idProdutoAlmoxarifado,
    idAlmoxarifado,
  }: FindReviewArgs): Promise<PatrimonyReviewData> {
    return api.get(`
      /abastecimento/resumo-patrimonio?custo=${custo}&startDate=${startDate}&endDate=${endDate}
      ${idPatrimonio ? `&idPatrimonio=${idPatrimonio}` : ''}
      ${idProdutoAlmoxarifado ? `&idProdutoAlmoxarifado=${idProdutoAlmoxarifado}` : ''}
      ${idAlmoxarifado ? `&idAlmoxarifado=${idAlmoxarifado}` : ''}
    `.replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g, ''));
  }

  findFuelReview({
    custo,
    startDate,
    endDate,
    idPatrimonio,
    idAlmoxarifado,
    idTipoPatrimonio,
  }: FindReviewArgs): Promise<FuelReviewData> {
    return api.get(`
      /abastecimento/resumo-combustivel?custo=${custo}&startDate=${startDate}&endDate=${endDate}
      ${idPatrimonio ? `&idPatrimonio=${idPatrimonio}` : ''}
      ${idAlmoxarifado ? `&idAlmoxarifado=${idAlmoxarifado}` : ''}
      ${idTipoPatrimonio ? `&idTipoPatrimonio=${idTipoPatrimonio}` : ''}
    `.replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g, ''));
  }
}

export default new AbastecimentoService();
