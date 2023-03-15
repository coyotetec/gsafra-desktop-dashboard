import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { subMonths } from 'date-fns';

interface RangeDates {
  startDate: Date | null;
  endDate: Date | null;
}

export interface FuelingMonthlyFiltersState {
  rangeDates: RangeDates;
  patrimony: string;
  fuel: string;
  storeroom: string;
  cost: string;
  patrimonyType: string;
}

interface ChangePayload {
  name: keyof FuelingMonthlyFiltersState;
  value: string | RangeDates;
}

const initialState: FuelingMonthlyFiltersState = {
  rangeDates: {
    startDate: subMonths(new Date(), 12),
    endDate: new Date(),
  },
  patrimony: '_',
  fuel: '_',
  storeroom: '_',
  cost: 'medio',
  patrimonyType: '_'
};

export const fuelingMonthlyFiltersSlice = createSlice({
  name: 'fuelingMonthlyFilters',
  initialState,
  reducers: {
    change: (state, action: PayloadAction<ChangePayload>) => {
      state[action.payload.name] = action.payload.value as RangeDates & string;
    },
  },
});

export const { change } = fuelingMonthlyFiltersSlice.actions;
export default fuelingMonthlyFiltersSlice.reducer;
