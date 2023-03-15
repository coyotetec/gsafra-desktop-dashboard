import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type optionType = {
  value: string;
  label: string;
}[];

export interface PatrimoniesListState {
  options: optionType;
  lastFetch: Date | null;
}

const initialState: PatrimoniesListState = {
  options: [],
  lastFetch: null
};

export const patrimoniesListSlice = createSlice({
  name: 'patrimoniesList',
  initialState,
  reducers: {
    setPatrimoniesData: (state, action: PayloadAction<optionType>) => {
      state.options = action.payload;
      state.lastFetch = new Date();
    },
  }
});

export const { setPatrimoniesData } = patrimoniesListSlice.actions;
export default patrimoniesListSlice.reducer;
