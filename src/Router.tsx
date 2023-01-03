import { Routes, Route, Navigate } from 'react-router-dom';

import { Financial } from './pages/Financial';
import { AccountMovements } from './pages/AccountMovements';
import { FinancialViews } from './pages/FinancialViews';
import { FinancialViewsDetails } from './pages/FinancialViewsDetails';

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/financeiro" />} />
      <Route path="/financeiro" element={<Financial />} />
      <Route path="/financeiro/movimento-contas/analitica" element={<AccountMovements />} />
      <Route path="/indicadores" element={<FinancialViews />} />
      <Route path="/indicadores/:id" element={<FinancialViewsDetails />} />
    </Routes>
  );
}
