import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { View, ViewTotal, ViewTotalizer } from '../../types/FinancialViews';
import { startOfMonth, startOfYear, subMonths } from 'date-fns';

interface RangeDates {
  startDate: Date | null;
  endDate: Date | null;
}

export interface FinancialView {
  id: number;
  nome: string;
  situacao: number;
  periodoPadraoMeses: number;
  total: ViewTotal[];
  totalizers: ViewTotalizer[];
  rangeDates: RangeDates;
  lastFetch: Date | null;
}

export interface FinancialViewsDataState {
  views: FinancialView[];
  lastFetch: Date | null;
}

interface ChangeViewPayload {
  id: number;
  name: keyof FinancialView;
  value: number | string | ViewTotal[] | ViewTotalizer[] | RangeDates | Date | null;
}

const initialState: FinancialViewsDataState = {
  views: [],
  lastFetch: null,
};

export const financialViewsDataSlice = createSlice({
  name: 'financialViewsData',
  initialState,
  reducers: {
    addViews: (state, action: PayloadAction<View[]>) => {
      state.views = action.payload.map((view) => ({
        id: view.id,
        nome: view.nome,
        situacao: view.situacao,
        periodoPadraoMeses: view.periodoPadraoMeses,
        total: [],
        totalizers: [],
        rangeDates: {
          startDate: view.periodoPadraoMeses === 0
            ? startOfMonth(new Date())
            : view.periodoPadraoMeses === -2
              ? startOfYear(new Date())
              : view.periodoPadraoMeses === -1
                ? null
                : subMonths(new Date(), view.periodoPadraoMeses),
          endDate: view.periodoPadraoMeses === -1 ? null : new Date(),
        },
        lastFetch: null,
      }));
      state.lastFetch = new Date();
    },
    changeView: (state, { payload }: PayloadAction<ChangeViewPayload>) => {
      const selectedViewIndex = state.views.findIndex(
        (view) => view.id === payload.id
      );

      if (selectedViewIndex === -1) {
        return;
      }

      state.views[selectedViewIndex][payload.name] = payload.value as number & string & ViewTotal[] & ViewTotalizer[] & RangeDates & Date;
      state.views[selectedViewIndex].lastFetch = new Date();
    }
  },
});

export const { addViews, changeView } = financialViewsDataSlice.actions;
export default financialViewsDataSlice.reducer;
