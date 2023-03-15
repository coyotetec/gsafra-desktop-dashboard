import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { subMonths } from 'date-fns';

interface RangeDates {
  startDate: Date | null;
  endDate: Date | null;
}

export interface FuelingPatrimonyFiltersState {
  rangeDates: RangeDates;
  patrimony: string;
  fuel: string;
  storeroom: string;
  cost: string;
}

interface ChangePayload {
  name: keyof FuelingPatrimonyFiltersState;
  value: string | RangeDates;
}

const initialState: FuelingPatrimonyFiltersState = {
  rangeDates: {
    startDate: subMonths(new Date(), 12),
    endDate: new Date(),
  },
  patrimony: '_',
  fuel: '_',
  storeroom: '_',
  cost: 'medio'
};

export const fuelingPatrimonyFiltersSlice = createSlice({
  name: 'fuelingPatrimonyFilters',
  initialState,
  reducers: {
    change: (state, action: PayloadAction<ChangePayload>) => {
      state[action.payload.name] = action.payload.value as RangeDates & string;
    },
  },
});

export const { change } = fuelingPatrimonyFiltersSlice.actions;
export default fuelingPatrimonyFiltersSlice.reducer;
