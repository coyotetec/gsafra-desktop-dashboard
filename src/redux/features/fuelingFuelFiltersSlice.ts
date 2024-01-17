import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { subMonths } from 'date-fns';

interface RangeDates {
  startDate: Date | null;
  endDate: Date | null;
}

export interface FuelingFuelFiltersState {
  rangeDates: RangeDates;
  patrimony: string;
  storeroom: string;
  cost: string;
  patrimonyType: string;
}

interface ChangePayload {
  name: keyof FuelingFuelFiltersState;
  value: string | RangeDates;
}

const initialState: FuelingFuelFiltersState = {
  rangeDates: {
    startDate: subMonths(new Date(), 12),
    endDate: new Date(),
  },
  patrimony: '_',
  storeroom: '_',
  cost: 'medio',
  patrimonyType: '_',
};

export const fuelingFuelFiltersSlice = createSlice({
  name: 'fuelingFuelFilters',
  initialState,
  reducers: {
    change: (state, action: PayloadAction<ChangePayload>) => {
      state[action.payload.name] = action.payload.value as RangeDates & string;
    },
  },
});

export const { change } = fuelingFuelFiltersSlice.actions;
export default fuelingFuelFiltersSlice.reducer;
