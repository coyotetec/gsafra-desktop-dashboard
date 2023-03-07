import { useCallback, useEffect, useState } from 'react';
import { addMonths, format } from 'date-fns';

import { Container, Header } from './styles';

import { DateInput } from '../../../../components/DateInput';

import FinancialService from '../../../../services/FinancialService';
import { CashFlow as CashFlowType } from '../../../../types/Financial';
import { CashFlowChart } from '../CashFlowChart';
import { toast } from '../../../../utils/toast';
import { useUserContext } from '../../../../contexts/UserContext';

interface CashFlowProps {
  safraId: string;
}

export function CashFlow({ safraId }: CashFlowProps) {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(addMonths(new Date(), 6));
  const [labels, setLabels] = useState<string[]>([]);
  const [cashFlow, setCashFlow] = useState<CashFlowType>({} as CashFlowType);
  const [isLoading, setIsLoading] = useState(true);

  const { hasPermission } = useUserContext();

  const loadData = useCallback(async () => {
    if (hasPermission('fluxo_caixa')) {
      setIsLoading(true);

      if (!startDate || !endDate) {
        setIsLoading(false);
        setCashFlow((prevState) => ({
          ...prevState,
          hasError: true,
          currentBalance: 0,
        }));
        toast({
          type: 'danger',
          text: 'Datas inicial e final são obrigatórias!'
        });
        return;
      }

      if (startDate > endDate) {
        setIsLoading(false);
        setCashFlow((prevState) => ({
          ...prevState,
          hasError: true,
          currentBalance: 0,
        }));
        toast({
          type: 'danger',
          text: 'Data final precisa ser maior que inicial!'
        });
        return;
      }

      const startDateParsed = format(startDate, 'dd-MM-yyyy');
      const endDateParsed = format(endDate, 'dd-MM-yyyy');

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
        isLoading={isLoading}
      />
    </Container>
  );
}
