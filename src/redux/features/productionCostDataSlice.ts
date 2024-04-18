import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  CustoCategoria,
  CustoIndividual,
  CustoTalhao,
} from '../../types/CustoProducao';

export interface ProductionCostDataState {
  categoryCost: CustoCategoria | null;
  talhaoCost: CustoTalhao | null;
  activityCost: CustoIndividual | null;
  maintenanceCost: CustoIndividual | null;
  fuelingCost: CustoIndividual | null;
}

interface SetDataPayload {
  name: keyof ProductionCostDataState;
  data: CustoCategoria | CustoTalhao | CustoIndividual;
}

const initialState: ProductionCostDataState = {
  categoryCost: null,
  talhaoCost: null,
  activityCost: null,
  maintenanceCost: null,
  fuelingCost: null,
};

export const productionCostDataSlice = createSlice({
  name: 'productionCostData',
  initialState,
  reducers: {
    setData: (state, { payload }: PayloadAction<SetDataPayload>) => {
      state[payload.name] = {
        ...payload.data,
      } as CustoCategoria & CustoTalhao & CustoIndividual;
    },
  },
});

export const { setData } = productionCostDataSlice.actions;
export default productionCostDataSlice.reducer;
