import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type optionType = {
  value: string;
  label: string;
}[];

export interface FuelsListState {
  options: optionType;
  lastFetch: Date | null;
}

const initialState: FuelsListState = {
  options: [],
  lastFetch: null,
};

export const fuelsListSlice = createSlice({
  name: 'fuelsList',
  initialState,
  reducers: {
    setFuelsData: (state, action: PayloadAction<optionType>) => {
      state.options = action.payload;
      state.lastFetch = new Date();
    },
  },
});

export const { setFuelsData } = fuelsListSlice.actions;
export default fuelsListSlice.reducer;
