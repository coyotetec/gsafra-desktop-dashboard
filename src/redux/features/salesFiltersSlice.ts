import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface RangeDates {
  startDate: Date | null;
  endDate: Date | null;
}

export interface SalesFiltersState {
  rangeDates: RangeDates;
  safra: string;
  deliveryStatus: string;
  clientAvarageUnit: string;
  monthlyAvarageUnit: string;
}

interface ChangePayload {
  name: keyof SalesFiltersState;
  value: string | RangeDates;
}

const initialState: SalesFiltersState = {
  rangeDates: {
    startDate: null,
    endDate: null,
  },
  safra: '_',
  deliveryStatus: '_',
  clientAvarageUnit: 'sacks',
  monthlyAvarageUnit: 'sacks'
};

export const salesFiltersSlice = createSlice({
  name: 'salesFilters',
  initialState,
  reducers: {
    change: (state, action: PayloadAction<ChangePayload>) => {
      state[action.payload.name] = action.payload.value as string & RangeDates;
    },
    setFirstSafra: (state, action: PayloadAction<string>) => {
      if (state.safra === '_') {
        state.safra = action.payload;
      }
    }
  },
});

export const { change, setFirstSafra } = salesFiltersSlice.actions;
export default salesFiltersSlice.reducer;
