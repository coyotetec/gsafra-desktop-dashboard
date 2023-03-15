import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { CustoCategoria, CustoIndividual, CustoTalhao } from '../../types/CustoProducao';

export interface ProductionCostDataState {
  categoryCost: CustoCategoria & {
    lastFetch: Date | null;
  };
  talhaoCost: CustoTalhao & {
    lastFetch: Date | null;
  };
  activityCost: CustoIndividual & {
    lastFetch: Date | null;
  };
  maintenanceCost: CustoIndividual & {
    lastFetch: Date | null;
  };
  fuelingCost: CustoIndividual & {
    lastFetch: Date | null;
  };
}

interface SetDataPayload {
  name: keyof ProductionCostDataState;
  data: CustoCategoria | CustoTalhao | CustoIndividual;
}

const initialState: ProductionCostDataState = {
  categoryCost: {
    totalCusto: 0,
    totalCustoPorHectare: 0,
    totalCustoCategoria: [],
    lastFetch: null,
  },
  talhaoCost: {
    totalCusto: 0,
    totalCustoPorHectare: 0,
    totalCustoTalhao: [],
    lastFetch: null,
  },
  activityCost: {
    inputsTotalSafra: 0,
    inputsTotalPorHectareSafra: 0,
    inputsTotal: [],
    lastFetch: null,
  },
  maintenanceCost: {
    inputsTotalSafra: 0,
    inputsTotalPorHectareSafra: 0,
    inputsTotal: [],
    lastFetch: null,
  },
  fuelingCost: {
    inputsTotalSafra: 0,
    inputsTotalPorHectareSafra: 0,
    inputsTotal: [],
    lastFetch: null,
  },
};

export const productionCostDataSlice = createSlice({
  name: 'productionCostData',
  initialState,
  reducers: {
    setData: (state, { payload }: PayloadAction<SetDataPayload>) => {
      state[payload.name] = {
        ...payload.data,
        lastFetch: new Date(),
      } as CustoCategoria & CustoTalhao & CustoIndividual & { lastFetch: Date | null; };
    }
  }
});

export const { setData } = productionCostDataSlice.actions;
export default productionCostDataSlice.reducer;
