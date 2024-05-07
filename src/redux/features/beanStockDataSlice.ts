import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  EstoqueGraosProdutorTotal,
  EstoqueGraosTotal,
} from '../../types/EstoqueGraos';

export interface BeanStockDataState {
  beanStock: EstoqueGraosTotal;
  beanStockProducer: EstoqueGraosProdutorTotal;
}

const initialState: BeanStockDataState = {
  beanStock: {
    saldoAnterior: 0,
    entradas: {
      peso: 0,
      descontoClassificacao: 0,
      taxaRecepcao: 0,
      cotaCapital: 0,
      taxaArmazenamento: 0,
      quebraTecnica: 0,
      pesoLiquido: 0,
    },
    saidas: {
      peso: 0,
      descontoClassificacao: 0,
      pesoLiquido: 0,
    },
    saldoFinal: 0,
  },
  beanStockProducer: {
    estoqueGraosProdutor: [],
    saldoFinal: [],
  },
};

export const beanStockDataSlice = createSlice({
  name: 'beanStockData',
  initialState,
  reducers: {
    setBeanStock: (state, { payload }: PayloadAction<EstoqueGraosTotal>) => {
      state.beanStock = payload;
    },
    setBeanStockProducer: (
      state,
      { payload }: PayloadAction<EstoqueGraosProdutorTotal>,
    ) => {
      state.beanStockProducer = payload;
    },
  },
});

export const { setBeanStock, setBeanStockProducer } =
  beanStockDataSlice.actions;
export default beanStockDataSlice.reducer;
