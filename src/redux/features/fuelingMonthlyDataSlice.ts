import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface FuelingMonthlyDataState {
  labels: string[];
  values: number[];
  valuesTotal: number;
  quantities: number[];
  quantitiesTotal: number;
  lastFetch: Date | null;
}

type SetDatePayload = Omit<FuelingMonthlyDataState, 'lastFetch'>;

const initialState: FuelingMonthlyDataState = {
  labels: [],
  values: [],
  valuesTotal: 0,
  quantities: [],
  quantitiesTotal: 0,
  lastFetch: null,
};

export const fuelingMonthlyDataSlice = createSlice({
  name: 'fuelingMonthlyData',
  initialState,
  reducers: {
    setData: (state, { payload }: PayloadAction<SetDatePayload>) => {
      for (const key of Object.keys(payload)) {
        state[key as keyof SetDatePayload] = payload[key as keyof SetDatePayload] as string[] & number[] & number;
      }
      state.lastFetch = new Date();
    },
  },
});

export const { setData } = fuelingMonthlyDataSlice.actions;
export default fuelingMonthlyDataSlice.reducer;
