import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ProductionFiltersState {
  safra: string;
  productionUnit: string;
  productivityUnit: string;
  discountsUnit: string;
  discount: string;
}

interface ChangePayload {
  name: keyof ProductionFiltersState;
  value: string;
}

const initialState: ProductionFiltersState = {
  safra: '_',
  productionUnit: 'sacks',
  productivityUnit: 'sacks',
  discountsUnit: 'percent',
  discount: 'umidade',
};

export const productionFiltersSlice = createSlice({
  name: 'productionFilters',
  initialState,
  reducers: {
    change: (state, action: PayloadAction<ChangePayload>) => {
      state[action.payload.name] = action.payload.value as string;
    },
    setFirstSafra: (state, action: PayloadAction<string>) => {
      if (state.safra === '_') {
        state.safra = action.payload;
      }
    },
  },
});

export const { change, setFirstSafra } = productionFiltersSlice.actions;
export default productionFiltersSlice.reducer;
