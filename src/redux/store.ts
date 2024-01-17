import { configureStore } from '@reduxjs/toolkit';
import accountsDataSlice from './features/accountsDataSlice';
import accountsFiltersSlice from './features/accountsFiltersSlice';
import beanStockDataSlice from './features/beanStockDataSlice';
import beanStockFiltersSlice from './features/beanStockFiltersSlice';
import chartAccountsListSlice from './features/chartAccountsListSlice';
import contractDataSlice from './features/contractDataSlice';
import contractFiltersSlice from './features/contractFiltersSlice';
import cropsListSlice from './features/cropsListSlice';
import financialCashFlowDataSlice from './features/financialCashFlowDataSlice';
import financialChartAccountsDataSlice from './features/financialChartAccountsDataSlice';
import financialFiltersSlice from './features/financialFiltersSlice';
import financialTotalizersDataSlice from './features/financialTotalizersDataSlice';
import financialViewsDataSlice from './features/financialViewsDataSlice';
import fuelingFuelDataSlice from './features/fuelingFuelDataSlice';
import fuelingFuelFiltersSlice from './features/fuelingFuelFiltersSlice';
import fuelingMonthlyDataSlice from './features/fuelingMonthlyDataSlice';
import fuelingMonthlyFiltersSlice from './features/fuelingMonthlyFiltersSlice';
import fuelingPatrimonyDataSlice from './features/fuelingPatrimonyDataSlice';
import fuelingPatrimonyFiltersSlice from './features/fuelingPatrimonyFiltersSlice';
import fuelsListSlice from './features/fuelsListSlice';
import patrimoniesListSlice from './features/patrimoniesListSlice';
import patrimonyTypesListSlice from './features/patrimonyTypesListSlice';
import producersListSlice from './features/producersListSlice';
import productionCostDataSlice from './features/productionCostDataSlice';
import productionCostFiltersSlice from './features/productionCostFiltersSlice';
import productionDataSlice from './features/productionDataSlice';
import productionFiltersSlice from './features/productionFiltersSlice';
import safrasListSlice from './features/safrasListSlice';
import salesDataSlice from './features/salesDataSlice';
import salesFiltersSlice from './features/salesFiltersSlice';
import storagesListSlice from './features/storagesListSlice';
import storeroomsListSlice from './features/storeroomsListSlice';

export const store = configureStore({
  reducer: {
    // Common lists
    cropsList: cropsListSlice,
    producersList: producersListSlice,
    storagesList: storagesListSlice,
    safrasList: safrasListSlice,
    patrimoniesList: patrimoniesListSlice,
    fuelsList: fuelsListSlice,
    storeroomsList: storeroomsListSlice,
    patrimonyTypesList: patrimonyTypesListSlice,
    chartAccountsList: chartAccountsListSlice,

    // Bean stock page
    beanStockFilters: beanStockFiltersSlice,
    beanStockData: beanStockDataSlice,

    // Financial page
    financialFilters: financialFiltersSlice,
    financialTotalizersData: financialTotalizersDataSlice,
    financialCashFlowData: financialCashFlowDataSlice,
    financialChartAccountsData: financialChartAccountsDataSlice,

    // Financial view page
    financialViewsData: financialViewsDataSlice,

    // Fueling monthly page
    fuelingMonthlyFilters: fuelingMonthlyFiltersSlice,
    fuelingMonthlyData: fuelingMonthlyDataSlice,

    // Fueling patrimony page
    fuelingPatrimonyFilters: fuelingPatrimonyFiltersSlice,
    fuelingPatrimonyData: fuelingPatrimonyDataSlice,

    // Fueling fuel page
    fuelingFuelFilters: fuelingFuelFiltersSlice,
    fuelingFuelData: fuelingFuelDataSlice,

    // Production page
    productionFilters: productionFiltersSlice,
    productionData: productionDataSlice,

    // Production cost page
    productionCostFilters: productionCostFiltersSlice,
    productionCostData: productionCostDataSlice,

    // Contract page
    contractFilters: contractFiltersSlice,
    contractData: contractDataSlice,

    // Sales page
    salesFilters: salesFiltersSlice,
    salesData: salesDataSlice,

    // Chart accounts financial page
    accountsFilters: accountsFiltersSlice,
    accountsData: accountsDataSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
