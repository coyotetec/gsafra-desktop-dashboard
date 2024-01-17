import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type optionType = {
  value: string;
  label: string;
}[];

export interface PatrimonyTypesListState {
  options: optionType;
  lastFetch: Date | null;
}

const initialState: PatrimonyTypesListState = {
  options: [],
  lastFetch: null,
};

export const patrimonyTypesListSlice = createSlice({
  name: 'patrimonyTypesList',
  initialState,
  reducers: {
    setPatrimonyTypesData: (state, action: PayloadAction<optionType>) => {
      state.options = action.payload;
      state.lastFetch = new Date();
    },
  },
});

export const { setPatrimonyTypesData } = patrimonyTypesListSlice.actions;
export default patrimonyTypesListSlice.reducer;
