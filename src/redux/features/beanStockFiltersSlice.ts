import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface RangeDates {
  startDate: Date | null;
  endDate: Date | null;
}

export interface BeanStockFiltersState {
  rangeDates: RangeDates;
  crop: string;
  producer: string;
  storage: string;
  safra: string;
  producerStockUnit: string;
  selectedProducerDetail: string;
}

interface ChangePayload {
  name: keyof BeanStockFiltersState;
  value: string | RangeDates;
}

const initialState: BeanStockFiltersState = {
  rangeDates: {
    startDate: null,
    endDate: null,
  },
  crop: '_',
  producer: '_',
  storage: '_',
  safra: '_',
  producerStockUnit: 'kg',
  selectedProducerDetail: '_',
};

export const beanStockFiltersSlice = createSlice({
  name: 'beanStockFilters',
  initialState,
  reducers: {
    change: (state, action: PayloadAction<ChangePayload>) => {
      state[action.payload.name] = action.payload.value as RangeDates & string;
    },
    setFirstCrop: (state, action: PayloadAction<string>) => {
      if (state.crop === '_') {
        state.crop = action.payload;
      }
    },
    setFirstProducerDetails: (state, action: PayloadAction<string>) => {
      if (state.selectedProducerDetail === '_') {
        state.selectedProducerDetail = action.payload;
      }
    },
  },
});

export const { change, setFirstCrop, setFirstProducerDetails } =
  beanStockFiltersSlice.actions;
export default beanStockFiltersSlice.reducer;
