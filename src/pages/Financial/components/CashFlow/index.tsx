import { useCallback, useContext, useEffect, useState } from 'react';
import { addMonths, format } from 'date-fns';

import { Container, Header } from './styles';

import { DateInput } from '../../../../components/DateInput';

import FinancialService from '../../../../services/FinancialService';
import { CashFlow as CashFlowType } from '../../../../types/Financial';
import { CashFlowChart } from '../CashFlowChart';
import { UserContext } from '../../../../components/App';

interface CashFlowProps {
  safraId: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CashFlow({ safraId, setIsLoading }: CashFlowProps) {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addMonths(new Date(), 6));
  const [labels, setLabels] = useState<string[]>([]);
  const [cashFlow, setCashFlow] = useState<CashFlowType>({} as CashFlowType);

  const { hasPermission } = useContext(UserContext);

  const loadData = useCallback(async () => {
    if (hasPermission('fluxo_caixa')) {
      setIsLoading(true);
      const startDateParsed = format(startDate, 'dd-MM-yyyy');
      const endDateParsed = format(endDate, 'dd-MM-yyyy');

      if (!startDate || !endDate) {
        return;
      }

      if (startDate > endDate) {
        return;
      }

      const cashFlowData = await FinancialService.findCashFlow(
        startDateParsed,
        endDateParsed,
        safraId !== '_' ? safraId : undefined
      );

      setLabels(cashFlowData.cashFlowCredits.map((i) => i.month));
      setCashFlow(cashFlowData);
    }

    setIsLoading(false);
  }, [hasPermission, startDate, endDate, safraId, setIsLoading]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Container>
      <Header>
        <h3>FLUXO DE CAIXA</h3>
        <div>
          <DateInput
            onChangeDate={(date) => setStartDate(date)}
            placeholder='Data Inicial'
            defaultDate={new Date()}
          />
          <strong>à</strong>
          <DateInput
            onChangeDate={(date) => setEndDate(date)}
            placeholder='Data Final'
            defaultDate={addMonths(new Date(), 6)}
          />
        </div>
      </Header>

      <CashFlowChart
        labels={labels}
        cashFlow={cashFlow}
        startDate={startDate}
        endDate={endDate}
      />
    </Container>
  );
}
