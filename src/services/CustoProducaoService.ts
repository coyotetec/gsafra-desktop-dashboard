import { CustoIndividual, CustoCategoria, CustoTalhao } from '../types/CustoProducao';
import HttpClient from './utils/HttpClient';
import { PORT } from './utils/info';

interface FindCustoCategoriaArgs {
  safraId: string | number;
  talhaoId?: number;
  startDate: string;
  endDate: string;
}

class CustoProducaoService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(`http://localhost:${PORT}`);
  }

  findCustoCategoria({ safraId, talhaoId, startDate, endDate }: FindCustoCategoriaArgs): Promise<CustoCategoria> {
    return this.httpClient.get(`
      /custo-producao/categoria?idSafra=${safraId}&startDate=${startDate}&endDate=${endDate}
      ${talhaoId ? `&idTalhao=${talhaoId}` : ''}
    `.replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g, ''));
  }

  findCustoTalhao({ safraId, talhaoId, startDate, endDate }: FindCustoCategoriaArgs): Promise<CustoTalhao> {
    return this.httpClient.get(`
      /custo-producao/talhao?idSafra=${safraId}&startDate=${startDate}&endDate=${endDate}
      ${talhaoId ? `&idTalhao=${talhaoId}` : ''}
    `.replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g, ''));
  }

  findCustoAtividade({ safraId, talhaoId, startDate, endDate }: FindCustoCategoriaArgs): Promise<CustoIndividual> {
    return this.httpClient.get(`
      /atividade-agricola/custo-producao?idSafra=${safraId}&startDate=${startDate}&endDate=${endDate}
      ${talhaoId ? `&idTalhao=${talhaoId}` : ''}
    `.replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g, ''));
  }

  findCustoManutencao({ safraId, talhaoId, startDate, endDate }: FindCustoCategoriaArgs): Promise<CustoIndividual> {
    return this.httpClient.get(`
      /manutencao/custo-producao?idSafra=${safraId}&startDate=${startDate}&endDate=${endDate}
      ${talhaoId ? `&idTalhao=${talhaoId}` : ''}
    `.replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g, ''));
  }

  findCustoAbastecimento({ safraId, talhaoId, startDate, endDate }: FindCustoCategoriaArgs): Promise<CustoIndividual> {
    return this.httpClient.get(`
      /abastecimento/custo-producao?idSafra=${safraId}&startDate=${startDate}&endDate=${endDate}
      ${talhaoId ? `&idTalhao=${talhaoId}` : ''}
    `.replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g, ''));
  }
}

export default new CustoProducaoService();
