import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { format } from 'date-fns';

import { Container, Header } from './styles';

import { DateInput } from '../../../../components/DateInput';

import FinancialService from '../../../../services/FinancialService';
import { CashFlowChart } from '../CashFlowChart';
import { toast } from '../../../../utils/toast';
import { useUserContext } from '../../../../contexts/UserContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { change } from '../../../../redux/features/financialFiltersSlice';
import { hasToFetch } from '../../../../utils/hasToFetch';
import { setData, setLabels } from '../../../../redux/features/financialCashFlowDataSlice';
import { componentsRefType } from '../../../../types/Types';

export const CashFlow = forwardRef<componentsRefType>((props, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const isFirstRender = useRef(true);

  const {
    financialFilters: { cashFlowRangeDates: { startDate, endDate }, safra },
    financialCashFlowData: cashFlow
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const { hasPermission } = useUserContext();

  const loadData = useCallback(async () => {
    if (hasPermission('fluxo_caixa')) {
      setIsLoading(true);

      if (isFirstRender.current) {
        isFirstRender.current = false;

        if (!hasToFetch(cashFlow.lastFetch)) {
          setIsLoading(false);
          return;
        }
      }

      if (!startDate || !endDate) {
        setIsLoading(false);
        dispatch(setData({
          currentBalance: 0,
          cashFlowBalance: [],
          cashFlowBalancePlan: [],
          cashFlowCredits: [],
          cashFlowCreditsPlan: [],
          cashFlowDebits: [],
          cashFlowDebitsPlan: [],
          hasError: false,
        }));
        dispatch(setLabels([]));
        toast({
          type: 'danger',
          text: 'Datas inicial e final são obrigatórias!'
        });
        return;
      }

      if (startDate > endDate) {
        setIsLoading(false);
        dispatch(setData({
          currentBalance: 0,
          cashFlowBalance: [],
          cashFlowBalancePlan: [],
          cashFlowCredits: [],
          cashFlowCreditsPlan: [],
          cashFlowDebits: [],
          cashFlowDebitsPlan: [],
          hasError: false,
        }));
        dispatch(setLabels([]));
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
        safra !== '_' ? safra : undefined
      );

      dispatch(setData(cashFlowData));
      dispatch(setLabels(cashFlowData.cashFlowCredits.map((i) => i.month)));
    }

    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPermission, startDate, endDate, safra, dispatch]);

  useImperativeHandle(ref, () => ({
    loadData
  }), [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Container>
      <Header>
        <h3>FLUXO DE CAIXA</h3>
        <div>
          <DateInput
            onChangeDate={(date) => {
              dispatch(change({
                name: 'cashFlowRangeDates', value: {
                  startDate: date,
                  endDate
                }
              }));
            }}
            placeholder='Data Inicial'
            defaultDate={startDate}
          />
          <strong>à</strong>
          <DateInput
            onChangeDate={(date) => {
              dispatch(change({
                name: 'cashFlowRangeDates', value: {
                  startDate,
                  endDate: date
                }
              }));
            }}
            placeholder='Data Final'
            defaultDate={endDate}
          />
        </div>
      </Header>

      <CashFlowChart
        labels={cashFlow.labels}
        cashFlow={cashFlow.data}
        startDate={startDate}
        endDate={endDate}
        isLoading={isLoading}
      />
    </Container>
  );
});
