import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ColheitaDescontoTotal, ColheitaTotal } from '../../types/Colheita';

export interface ProductionDataState {
  harvest: ColheitaTotal & {
    lastFetch: Date | null;
  };
  discount: ColheitaDescontoTotal & {
    lastFetch: Date | null;
  };
}

interface SetDataPayload {
  name: keyof ProductionDataState;
  data: ColheitaTotal | ColheitaDescontoTotal;
}

const initialState: ProductionDataState = {
  harvest: {
    totalSafra: 0,
    sacasSafra: 0,
    totalPorHectareSafra: 0,
    sacasPorHectareSafra: 0,
    talhoesTotal: [],
    lastFetch: null,
  },
  discount: {
    pesoTotalSafra: 0,
    porcentagemDescontoSafra: 0,
    totalDescontoRealSafra: 0,
    totalDescontoSafra: 0,
    talhoesDescontoTotal: [],
    lastFetch: null,
  },
};

export const productionDataSlice = createSlice({
  name: 'productionData',
  initialState,
  reducers: {
    setData: (state, { payload }: PayloadAction<SetDataPayload>) => {
      state[payload.name] = {
        ...payload.data,
        lastFetch: new Date(),
      } as ColheitaTotal & ColheitaDescontoTotal & { lastFetch: Date | null };
    },
  },
});

export const { setData } = productionDataSlice.actions;
export default productionDataSlice.reducer;
