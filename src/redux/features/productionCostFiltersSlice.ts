import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { subMonths } from 'date-fns';

interface RangeDates {
  startDate: Date | null;
  endDate: Date | null;
}

type optionType = {
  value: string;
  label: string;
}[];

type groupedOptionsType = {
  label: string;
  items: {
    label: string;
    value: string;
  }[];
}[];

export interface ProductionCostFiltersState {
  rangeDates: RangeDates;
  talhoesOptions: groupedOptionsType;
  talhao: string | null;
  unit: string;
  safras: string[];
  lastSelectedSafras: string[];
  selectedSafrasOptions: optionType;
  activityUnit: string;
  maintenanceUnit: string;
  fuelingUnit: string;
  talhaoSelectedSafra: string;
}

interface ChangePayload {
  name: keyof ProductionCostFiltersState;
  value:
    | string
    | string[]
    | RangeDates
    | null
    | optionType
    | groupedOptionsType;
}

const initialState: ProductionCostFiltersState = {
  rangeDates: {
    startDate: subMonths(new Date(), 12),
    endDate: new Date(),
  },
  talhao: null,
  talhoesOptions: [],
  unit: 'cost',
  safras: [],
  lastSelectedSafras: [],
  selectedSafrasOptions: [],
  activityUnit: 'parent',
  maintenanceUnit: 'parent',
  fuelingUnit: 'parent',
  talhaoSelectedSafra: '_',
};

export const productionCostFiltersSlice = createSlice({
  name: 'productionCostFilters',
  initialState,
  reducers: {
    change: (state, action: PayloadAction<ChangePayload>) => {
      state[action.payload.name] = action.payload.value as RangeDates &
        string &
        string[] &
        optionType &
        groupedOptionsType;
    },
    setFirstSafra: (state, action: PayloadAction<string | null>) => {
      if (state.safras.length === 0 && action.payload) {
        state.safras = [action.payload];
      }
    },
  },
});

export const { change, setFirstSafra } = productionCostFiltersSlice.actions;
export default productionCostFiltersSlice.reducer;
