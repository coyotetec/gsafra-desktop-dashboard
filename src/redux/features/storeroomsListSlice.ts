import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type optionType = {
  value: string;
  label: string;
}[];

export interface StoreroomsListState {
  options: optionType;
  lastFetch: Date | null;
}

const initialState: StoreroomsListState = {
  options: [],
  lastFetch: null,
};

export const storeroomsListSlice = createSlice({
  name: 'storeroomsList',
  initialState,
  reducers: {
    setStoreroomsData: (state, action: PayloadAction<optionType>) => {
      state.options = action.payload;
      state.lastFetch = new Date();
    },
  },
});

export const { setStoreroomsData } = storeroomsListSlice.actions;
export default storeroomsListSlice.reducer;
