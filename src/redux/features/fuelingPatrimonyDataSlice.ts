import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface FuelingPatrimonyDataState {
  labels: string[];
  values: number[];
  valuesTotal: number;
  quantities: number[];
  quantitiesTotal: number;
  lastFetch: Date | null;
}

type SetDatePayload = Omit<FuelingPatrimonyDataState, 'lastFetch'>;

const initialState: FuelingPatrimonyDataState = {
  labels: [],
  values: [],
  valuesTotal: 0,
  quantities: [],
  quantitiesTotal: 0,
  lastFetch: null,
};

export const fuelingPatrimonyDataSlice = createSlice({
  name: 'fuelingPatrimonyData',
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

export const { setData } = fuelingPatrimonyDataSlice.actions;
export default fuelingPatrimonyDataSlice.reducer;
