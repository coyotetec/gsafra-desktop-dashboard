import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface FinancialChartAccountsDataState {
  credit: {
    labels: string[];
    data: number[];
    lastFetch: Date | null;
  }
  debit: {
    labels: string[];
    data: number[];
    lastFetch: Date | null;
  }
}

interface SetDatePayload {
  type: keyof FinancialChartAccountsDataState;
  labels: string[];
  data: number[];
}

const initialState: FinancialChartAccountsDataState = {
  credit: {
    labels: [],
    data: [],
    lastFetch: null,
  },
  debit: {
    labels: [],
    data: [],
    lastFetch: null,
  },
};

export const financialChartAccountsDataSlice = createSlice({
  name: 'financialChartAccountsData',
  initialState,
  reducers: {
    setData: (state, { payload }: PayloadAction<SetDatePayload>) => {
      state[payload.type].labels = payload.labels;
      state[payload.type].data = payload.data;
      state[payload.type].lastFetch = new Date();
    },
  },
});

export const { setData } = financialChartAccountsDataSlice.actions;
export default financialChartAccountsDataSlice.reducer;
