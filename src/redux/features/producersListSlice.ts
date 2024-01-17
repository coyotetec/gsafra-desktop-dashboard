import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type optionType = {
  value: string;
  label: string;
}[];

export interface ProducersListState {
  options: optionType;
  lastFetch: Date | null;
}

const initialState: ProducersListState = {
  options: [],
  lastFetch: null,
};

export const producersListSlice = createSlice({
  name: 'producersList',
  initialState,
  reducers: {
    setProducersData: (state, action: PayloadAction<optionType>) => {
      state.options = action.payload;
      state.lastFetch = new Date();
    },
  },
});

export const { setProducersData } = producersListSlice.actions;
export default producersListSlice.reducer;
