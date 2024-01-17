import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type optionType = {
  value: string;
  label: string;
}[];

export interface SafrasListState {
  options: optionType;
  lastFetch: Date | null;
}

const initialState: SafrasListState = {
  options: [],
  lastFetch: null,
};

export const safrasListSlice = createSlice({
  name: 'safrasList',
  initialState,
  reducers: {
    setSafrasData: (state, action: PayloadAction<optionType>) => {
      state.options = action.payload;
      state.lastFetch = new Date();
    },
  },
});

export const { setSafrasData } = safrasListSlice.actions;
export default safrasListSlice.reducer;
