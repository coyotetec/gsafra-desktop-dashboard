import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { CashFlow } from '../../types/Financial';

export interface FinancialCashFlowDataState {
  data: CashFlow;
  labels: string[];
  lastFetch: Date | null;
}

const initialState: FinancialCashFlowDataState = {
  data: {
    currentBalance: 0,
    cashFlowBalance: [],
    cashFlowBalancePlan: [],
    cashFlowCredits: [],
    cashFlowCreditsPlan: [],
    cashFlowDebits: [],
    cashFlowDebitsPlan: [],
    hasError: false,
  },
  labels: [],
  lastFetch: null,
};

export const financialCashFlowDataSlice = createSlice({
  name: 'financialCashFlowData',
  initialState,
  reducers: {
    setData: (state, { payload }: PayloadAction<CashFlow>) => {
      state.data = payload;
      state.lastFetch = new Date();
    },
    setLabels: (state, { payload }: PayloadAction<string[]>) => {
      state.labels = payload;
    }
  },
});

export const { setData, setLabels } = financialCashFlowDataSlice.actions;
export default financialCashFlowDataSlice.reducer;
