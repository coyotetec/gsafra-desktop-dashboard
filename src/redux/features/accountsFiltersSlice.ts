import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { addMonths, endOfMonth, startOfMonth } from 'date-fns';

export interface AccountsFiltersState {
  options: string[];
  showZeros: boolean;
  startDate: Date | null;
  endDate: Date | null;
}

interface ChangePayload {
  name: keyof AccountsFiltersState;
  value: string[] | boolean | Date | null;
}

const initialState: AccountsFiltersState = {
  options: ['payments', 'receivables', 'checks', 'creditCard'],
  showZeros: false,
  startDate: startOfMonth(new Date()),
  endDate: endOfMonth(addMonths(new Date(), 2)),
};

export const accountsFiltersSlice = createSlice({
  name: 'accountsFilters',
  initialState,
  reducers: {
    change: (state, action: PayloadAction<ChangePayload>) => {
      state[action.payload.name] = action.payload.value as string[] & boolean & Date & null;
    },
  },
});

export const { change } = accountsFiltersSlice.actions;
export default accountsFiltersSlice.reducer;
