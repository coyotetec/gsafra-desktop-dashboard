import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Contrato, Romaneio } from '../../types/Contrato';

type optionType = {
  value: string;
  label: string;
}[];

export interface ContractDataState {
  contracts: Contrato[];
  contractOptions: optionType;
  contractsLastFetch: Date | null;
  packingList: Romaneio[];
  packingListLastFetch: Date | null;
}

const initialState: ContractDataState = {
  contracts: [],
  contractOptions: [],
  contractsLastFetch: null,
  packingList: [],
  packingListLastFetch: null,
};

export const contractDataSlice = createSlice({
  name: 'contractData',
  initialState,
  reducers: {
    setContracts: (state, { payload }: PayloadAction<Contrato[]>) => {
      state.contracts = payload;
      state.contractOptions = payload.reduce((result, item) => {
        if (item.totalEntregue > 0) {
          result.push({
            value: String(item.id),
            label: `${item.cliente} - ${item.numeroContrato}`
          });
        }

        return result;
      }, [] as optionType);
      state.contractsLastFetch = new Date();
    },
    setPackingList: (state, { payload }: PayloadAction<Romaneio[]>) => {
      state.packingList = payload;
      state.packingListLastFetch = new Date();
    }
  }
});

export const { setContracts, setPackingList } = contractDataSlice.actions;
export default contractDataSlice.reducer;
