import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { addMonths, subMonths } from 'date-fns';
import { TreeSelectSelectionKeys } from 'primereact/treeselect';

interface RangeDates {
  startDate: Date | null;
  endDate: Date | null;
}

export interface FinancialFiltersState {
  safra: string;
  status: string;
  totalizerRangeDates: RangeDates;
  cashFlowRangeDates: RangeDates;
  chartAccountsCreditRangeDates: RangeDates;
  chartAccountsCreditSelected: TreeSelectSelectionKeys;
  chartAccountsDebitRangeDates: RangeDates;
  chartAccountsDebitSelected: TreeSelectSelectionKeys;
}

interface ChangePayload {
  name: keyof FinancialFiltersState;
  value: string | number | RangeDates | TreeSelectSelectionKeys | null;
}

const initialState: FinancialFiltersState = {
  safra: '_',
  status: '_',
  totalizerRangeDates: {
    startDate: new Date(),
    endDate: addMonths(new Date(), 6),
  },
  cashFlowRangeDates: {
    startDate: new Date(),
    endDate: addMonths(new Date(), 6),
  },
  chartAccountsCreditRangeDates: {
    startDate: subMonths(new Date(), 12),
    endDate: new Date(),
  },
  chartAccountsCreditSelected: null,
  chartAccountsDebitRangeDates: {
    startDate: subMonths(new Date(), 12),
    endDate: new Date(),
  },
  chartAccountsDebitSelected: null,
};

export const financialFiltersSlice = createSlice({
  name: 'financialFilters',
  initialState,
  reducers: {
    change: (state, action: PayloadAction<ChangePayload>) => {
      state[action.payload.name] = action.payload.value as RangeDates & string & number;
    },
  },
});

export const { change } = financialFiltersSlice.actions;
export default financialFiltersSlice.reducer;
