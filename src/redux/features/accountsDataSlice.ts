import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import TreeNode from 'primereact/treenode';

export interface AccountsDataState {
  months: string[];
  accountsNodes: TreeNode[];
  accountsTotal: number;
  eachMonthTotal: number[];
  lastFetch: Date | null;
}

const initialState: AccountsDataState = {
  months: [],
  accountsNodes: [],
  accountsTotal: 0,
  eachMonthTotal: [],
  lastFetch: null,
};

export const accountsDataSlice = createSlice({
  name: 'accountsData',
  initialState,
  reducers: {
    setData: (
      state,
      {
        payload,
      }: PayloadAction<{
        accounts: TreeNode[];
        total: number;
        eachMonthTotal: number[];
        months: string[];
      }>,
    ) => {
      state.accountsNodes = payload.accounts;
      state.accountsTotal = payload.total;
      state.eachMonthTotal = payload.eachMonthTotal;
      state.months = payload.months;
      state.lastFetch = new Date();
    },
  },
});

export const { setData } = accountsDataSlice.actions;
export default accountsDataSlice.reducer;
