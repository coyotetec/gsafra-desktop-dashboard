import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import TreeNode from 'primereact/treenode';

export interface ChartAccountsState {
  credit: TreeNode[];
  debit: TreeNode[];
  lastFetch: Date | null;
}

interface SetChartAccountsDataPayload {
  credit: TreeNode[];
  debit: TreeNode[];
}

const initialState: ChartAccountsState = {
  credit: [],
  debit: [],
  lastFetch: null
};

export const chartAccountsSlice = createSlice({
  name: 'chartAccounts',
  initialState,
  reducers: {
    setChartAccountsData: (state, { payload }: PayloadAction<SetChartAccountsDataPayload>) => {
      state.credit = payload.credit;
      state.debit = payload.debit;
      state.lastFetch = new Date();
    },
  }
});

export const { setChartAccountsData } = chartAccountsSlice.actions;
export default chartAccountsSlice.reducer;
