import { DetailsData, FuelReviewData, MonthlyReviewData, PatrimonyReviewData } from '../types/Abastecimento';
import HttpClient from './utils/HttpClient';
import { PORT } from './utils/info';

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
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(`http://localhost:${PORT}`);
  }

  findMonthlyReview({
    custo,
    startDate,
    endDate,
    idPatrimonio,
    idProdutoAlmoxarifado,
    idAlmoxarifado,
    idTipoPatrimonio,
  }: FindReviewArgs): Promise<MonthlyReviewData> {
    return this.httpClient.get(`
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
    return this.httpClient.get(`
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
    return this.httpClient.get(`
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
    return this.httpClient.get(`
      /abastecimento/resumo-combustivel?custo=${custo}&startDate=${startDate}&endDate=${endDate}
      ${idPatrimonio ? `&idPatrimonio=${idPatrimonio}` : ''}
      ${idAlmoxarifado ? `&idAlmoxarifado=${idAlmoxarifado}` : ''}
      ${idTipoPatrimonio ? `&idTipoPatrimonio=${idTipoPatrimonio}` : ''}
    `.replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g, ''));
  }
}

export default new AbastecimentoService();
