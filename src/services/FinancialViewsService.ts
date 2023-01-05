import { View, ViewDetail, ViewTotal, ViewTotalizer } from '../types/FinancialViews';
import HttpClient from './utils/HttpClient';

interface ViewTotalReturn {
  data: ViewTotal[],
  totalizadores: ViewTotalizer[],
}

class FinancialViewsService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient('http://localhost:3001');
  }

  findViews(): Promise<View[]> {
    return this.httpClient.get('/financeiro-views');
  }

  findViewTotal(viewId: number, startDate: string, endDate: string): Promise<ViewTotalReturn> {
    return this.httpClient.get(`/financeiro-views/${viewId}?startDate=${startDate}&endDate=${endDate}`);
  }

  findViewDetails(viewId: number, startDate: string, endDate: string): Promise<ViewDetail[]> {
    return this.httpClient.get(`/financeiro-views/${viewId}/detalhes?startDate=${startDate}&endDate=${endDate}`);
  }
}

export default new FinancialViewsService();
