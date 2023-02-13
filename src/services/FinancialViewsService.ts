import { api } from './utils/api';
import {
  View,
  ViewDetail,
  ViewTotal,
  ViewTotalizer
} from '../types/FinancialViews';

interface ViewTotalReturn {
  data: ViewTotal[],
  totalizadores: ViewTotalizer[],
}

class FinancialViewsService {
  findViews(): Promise<View[]> {
    return api.get('/financeiro-views');
  }

  findViewTotal(viewId: number, startDate: string, endDate: string): Promise<ViewTotalReturn> {
    return api.get(`/financeiro-views/${viewId}?startDate=${startDate}&endDate=${endDate}`);
  }

  findViewDetails(viewId: number, startDate: string, endDate: string): Promise<ViewDetail[]> {
    return api.get(`/financeiro-views/${viewId}/detalhes?startDate=${startDate}&endDate=${endDate}`);
  }
}

export default new FinancialViewsService();
