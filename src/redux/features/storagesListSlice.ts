import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type optionType = {
  value: string;
  label: string;
}[];

export interface StoragesListState {
  options: optionType;
  lastFetch: Date | null;
}

const initialState: StoragesListState = {
  options: [],
  lastFetch: null
};

export const storagesListSlice = createSlice({
  name: 'storagesList',
  initialState,
  reducers: {
    setStoragesData: (state, action: PayloadAction<optionType>) => {
      state.options = action.payload;
      state.lastFetch = new Date();
    },
  }
});

export const { setStoragesData } = storagesListSlice.actions;
export default storagesListSlice.reducer;
