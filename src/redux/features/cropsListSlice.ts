import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type optionType = {
  value: string;
  label: string;
}[];

export interface CropsListState {
  options: optionType;
  lastFetch: Date | null;
}

const initialState: CropsListState = {
  options: [],
  lastFetch: null
};

export const cropsListSlice = createSlice({
  name: 'cropsList',
  initialState,
  reducers: {
    setCropsData: (state, action: PayloadAction<optionType>) => {
      state.options = action.payload;
      state.lastFetch = new Date();
    },
  }
});

export const { setCropsData } = cropsListSlice.actions;
export default cropsListSlice.reducer;
