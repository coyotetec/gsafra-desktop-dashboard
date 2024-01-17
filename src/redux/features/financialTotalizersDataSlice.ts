import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Total } from '../../types/Financial';
import { CreditCardTotal } from '../../types/CreditCard';

interface PendingTotal {
  accounts: Total;
  check: Total;
  total: Total;
}

export interface FinancialTotalizersDataState {
  payableTotalizer: PendingTotal & {
    lastFetch: Date | null;
  };
  receivableTotalizer: PendingTotal & {
    accounts: Total;
    check: Total;
    total: Total;
    lastFetch: Date | null;
  };
  creditCardTotalizer: CreditCardTotal & {
    lastFetch: Date | null;
  };
}

interface ChangePayload {
  name: keyof FinancialTotalizersDataState;
  value: CreditCardTotal | PendingTotal;
}

const zeroTotal: Total = {
  quantity: 0,
  total: 0,
  totalNextSeven: {
    quantity: 0,
    total: 0,
  },
  totalNextFifteen: {
    quantity: 0,
    total: 0,
  },
};

const initialState: FinancialTotalizersDataState = {
  payableTotalizer: {
    accounts: zeroTotal,
    check: zeroTotal,
    total: zeroTotal,
    lastFetch: null,
  },
  receivableTotalizer: {
    accounts: zeroTotal,
    check: zeroTotal,
    total: zeroTotal,
    lastFetch: null,
  },
  creditCardTotalizer: {
    quantity: 0,
    total: 0,
    availableLimit: 0,
    totalLimit: 0,
    usagePercentage: 0,
    lastFetch: null,
  },
};

export const financialTotalizersDataSlice = createSlice({
  name: 'financialTotalizersData',
  initialState,
  reducers: {
    change: (state, { payload }: PayloadAction<ChangePayload>) => {
      state[payload.name] = {
        ...payload.value,
        lastFetch: new Date(),
      } as PendingTotal & CreditCardTotal & { lastFetch: Date | null };
    },
  },
});

export const { change } = financialTotalizersDataSlice.actions;
export default financialTotalizersDataSlice.reducer;
