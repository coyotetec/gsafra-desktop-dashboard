import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface RangeDates {
  startDate: Date | null;
  endDate: Date | null;
}

export interface ContractFiltersState {
  safra: string;
  selectedContract: string;
  packingListRangeDates: RangeDates;
}

interface ChangePayload {
  name: keyof ContractFiltersState;
  value: string | RangeDates;
}

const initialState: ContractFiltersState = {
  safra: '_',
  selectedContract: '_',
  packingListRangeDates: {
    startDate: null,
    endDate: null
  }
};

export const contractFiltersSlice = createSlice({
  name: 'contractFilters',
  initialState,
  reducers: {
    change: (state, action: PayloadAction<ChangePayload>) => {
      state[action.payload.name] = action.payload.value as string & RangeDates;
    },
    setFirstSafra: (state, action: PayloadAction<string>) => {
      if (state.safra === '_') {
        state.safra = action.payload;
      }
    },
    setFirstContract: (state, action: PayloadAction<string>) => {
      if (state.selectedContract === '_') {
        state.selectedContract = action.payload;
      }
    }
  },
});

export const { change, setFirstSafra, setFirstContract } = contractFiltersSlice.actions;
export default contractFiltersSlice.reducer;
