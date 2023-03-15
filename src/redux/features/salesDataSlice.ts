import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { MediaCliente, MediaMes, Venda } from '../../types/Venda';

export interface salesDataState {
  sales: Venda[];
  salesLastFetch: Date | null;
  clientAvarage: MediaCliente[];
  clientAvarageLastFetch: Date | null;
  monthlyAvarage: MediaMes;
  monthlyAvarageLastFetch: Date | null;
}

const initialState: salesDataState = {
  sales: [],
  salesLastFetch: null,
  clientAvarage: [],
  clientAvarageLastFetch: null,
  monthlyAvarage: {
    mediaSafraKg: 0,
    mediaSafraSaca: 0,
    mediaMes: []
  },
  monthlyAvarageLastFetch: null,
};

export const salesDataSlice = createSlice({
  name: 'salesData',
  initialState,
  reducers: {
    setSales: (state, { payload }: PayloadAction<Venda[]>) => {
      state.sales = payload;
      state.salesLastFetch = new Date();
    },
    setClientAvarage: (state, { payload }: PayloadAction<MediaCliente[]>) => {
      state.clientAvarage = payload;
      state.clientAvarageLastFetch = new Date();
    },
    setMonthlyAvarage: (state, { payload }: PayloadAction<MediaMes>) => {
      state.monthlyAvarage = payload;
      state.monthlyAvarageLastFetch = new Date();
    }
  }
});

export const { setSales, setClientAvarage, setMonthlyAvarage } = salesDataSlice.actions;
export default salesDataSlice.reducer;
