import { Routes, Route, Navigate } from 'react-router-dom';

import { Financial } from './pages/Financial';
import { AccountMovements } from './pages/AccountMovements';
import { FinancialViews } from './pages/FinancialViews';
import { FinancialViewsDetails } from './pages/FinancialViewsDetails';
import { FuelingMonthlyReview } from './pages/FuelingMonthlyReview';
import { FuelingPatrimonyReview } from './pages/FuelingPatrimonyReview';
import { FuelingFuelReview } from './pages/FuelingFuelReview';
import { FuelingMonthlyDetails } from './pages/FuelingMonthlyDetails';
import { FuelingPatrimonyDetails } from './pages/FuelingPatrimonyDetails';
import { FuelingFuelDetails } from './pages/FuelingFuelDetails';
import { Production } from './pages/Production';
import { ProductionCost } from './pages/ProductionCost';
import { Contracts } from './pages/Contracts';
import { Sales } from './pages/Sales';
import { SalesPackingList } from './pages/SalesPackingList';
import { BeanStock } from './pages/BeanStock';
import { ChartAccountsFinancial } from './pages/ChartAccountsFinancial';

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/financeiro" />} />
      <Route path="/financeiro" element={<Financial />} />
      <Route
        path="/financeiro/movimento-contas/analitica"
        element={<AccountMovements />}
      />
      <Route path="/indicadores" element={<FinancialViews />} />
      <Route path="/indicadores/:id" element={<FinancialViewsDetails />} />
      <Route
        path="/abastecimento/resumo-mensal"
        element={<FuelingMonthlyReview />}
      />
      <Route
        path="/abastecimento/resumo-mensal/analitica"
        element={<FuelingMonthlyDetails />}
      />
      <Route
        path="/abastecimento/resumo-patrimonio"
        element={<FuelingPatrimonyReview />}
      />
      <Route
        path="/abastecimento/resumo-patrimonio/analitica"
        element={<FuelingPatrimonyDetails />}
      />
      <Route
        path="/abastecimento/resumo-combustivel"
        element={<FuelingFuelReview />}
      />
      <Route
        path="/abastecimento/resumo-combustivel/analitica"
        element={<FuelingFuelDetails />}
      />
      <Route path="/producao" element={<Production />} />
      <Route path="/custo-producao" element={<ProductionCost />} />
      <Route path="/contratos" element={<Contracts />} />
      <Route path="/vendas" element={<Sales />} />
      <Route path="/vendas/romaneios" element={<SalesPackingList />} />
      <Route path="/estoque-graos" element={<BeanStock />} />
      <Route
        path="/contas-receber-pagar"
        element={<ChartAccountsFinancial />}
      />
    </Routes>
  );
}
