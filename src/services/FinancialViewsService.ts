import { api } from './utils/api';
import {
  View,
  ViewDetail,
  ViewTotal,
  ViewTotalizer,
} from '../types/FinancialViews';

interface ViewTotalReturn {
  data: ViewTotal[];
  totalizadores: ViewTotalizer[];
}

class FinancialViewsService {
  async findViews() {
    const { data } = await api.get<View[]>('/financeiro-views');

    return data;
  }

  async findViewTotal(viewId: number, startDate: string, endDate: string) {
    const { data } = await api.get<ViewTotalReturn>(
      `/financeiro-views/${viewId}`,
      {
        params: {
          startDate,
          endDate,
        },
      },
    );

    return data;
  }

  async findViewDetails(viewId: number, startDate: string, endDate: string) {
    const { data } = await api.get<ViewDetail[]>(
      `/financeiro-views/${viewId}`,
      {
        params: {
          startDate,
          endDate,
        },
      },
    );

    return data;
  }
}

export default new FinancialViewsService();
