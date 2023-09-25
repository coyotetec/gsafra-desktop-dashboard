import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Content, Loader } from './styles';
import PlanoContaService from '../../../../services/PlanoContaService';
import { ChartAccountsChart } from '../ChartAccountsChart';
import { Spinner } from '../../../../components/Spinner';
import { DateInput } from '../../../../components/DateInput';
import { format } from 'date-fns';
import { ChartAccountsSelect } from '../../../../components/ChartAccoutsSelect';
import { NotAllowed } from '../../../../components/NotAllowed';
import html2canvas from 'html2canvas';
import { DownloadSimple } from 'phosphor-react';
import { toast } from '../../../../utils/toast';
import { useUserContext } from '../../../../contexts/UserContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { change } from '../../../../redux/features/financialFiltersSlice';
import { parseChartAccounts } from '../../utils/parseChartAccounts';
import { setChartAccountsData } from '../../../../redux/features/chartAccountsListSlice';
import { hasToFetch } from '../../../../utils/hasToFetch';
import { setData } from '../../../../redux/features/financialChartAccountsDataSlice';
import { componentsRefType } from '../../../../types/Types';

export const ChartAccounts = forwardRef<componentsRefType>((props, ref) => {
  const [debitTotalIsLoading, setDebitTotalIsLoading] = useState(true);
  const [creditTotalIsLoading, setCreditTotalIsLoading] = useState(true);
  const creditChartRef = useRef(null);
  const isCreditFirstRender = useRef(true);
  const debitChartRef = useRef(null);
  const isDebitFirstRender = useRef(true);

  const {
    financialFilters: {
      chartAccountsCreditRangeDates: {
        startDate: creditStartDate,
        endDate: creditEndDate
      },
      chartAccountsDebitRangeDates: {
        startDate: debitStartDate,
        endDate: debitEndDate,
      },
      chartAccountsCreditSelected: selectedCredit,
      chartAccountsDebitSelected: selectedDebit,
      lastSelectedSafras: safras,
    },
    chartAccountsList,
    financialChartAccountsData: {
      credit,
      debit
    }
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const { hasPermission } = useUserContext();

  const loadCreditTotal = useCallback(async () => {
    if (hasPermission('creditos_compensados')) {
      setCreditTotalIsLoading(true);

      if (isCreditFirstRender.current) {
        isCreditFirstRender.current = false;

        if (!hasToFetch(credit.lastFetch)) {
          setCreditTotalIsLoading(false);
          return;
        }
      }

      if (!selectedCredit) {
        setCreditTotalIsLoading(false);
        return;
      }

      if (creditEndDate && creditStartDate && creditEndDate < creditStartDate) {
        setCreditTotalIsLoading(false);
        dispatch(setData({
          type: 'credit',
          data: [],
          labels: [],
        }));
        toast({
          type: 'danger',
          text: 'Data final precisa ser maior que inicial!'
        });
        return;
      }

      const startDateParsed = creditStartDate ? format(creditStartDate, 'dd-MM-yyyy') : '';
      const endDateParsed = creditEndDate ? format(creditEndDate, 'dd-MM-yyyy') : '';

      const creditTotalData = await PlanoContaService.findPlanoContasTotal(
        String(selectedCredit),
        startDateParsed,
        endDateParsed,
        safras.length > 0 ? safras.join(',') : undefined,
      );

      dispatch(setData({
        type: 'credit',
        data: creditTotalData.map((item) => item.total),
        labels: creditTotalData.map((item) => item.descricao),
      }));
    }

    setCreditTotalIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creditEndDate, creditStartDate, dispatch, hasPermission, safras, selectedCredit]);

  const loadDebitTotal = useCallback(async () => {
    if (hasPermission('debitos_compensados')) {
      setDebitTotalIsLoading(true);

      if (isDebitFirstRender.current) {
        isDebitFirstRender.current = false;

        if (!hasToFetch(credit.lastFetch)) {
          setDebitTotalIsLoading(false);
          return;
        }
      }

      if (!selectedDebit) {
        setDebitTotalIsLoading(false);
        return;
      }

      if (debitEndDate && debitStartDate && debitEndDate < debitStartDate) {
        setDebitTotalIsLoading(false);
        dispatch(setData({
          type: 'debit',
          data: [],
          labels: [],
        }));
        toast({
          type: 'danger',
          text: 'Data final precisa ser maior que inicial!'
        });
        return;
      }

      const startDateParsed = debitStartDate ? format(debitStartDate, 'dd-MM-yyyy') : '';
      const endDateParsed = debitEndDate ? format(debitEndDate, 'dd-MM-yyyy') : '';

      const debitTotalData = await PlanoContaService.findPlanoContasTotal(
        String(selectedDebit),
        startDateParsed,
        endDateParsed,
        safras.length > 0 ? safras.join(',') : undefined,
      );

      dispatch(setData({
        type: 'debit',
        data: debitTotalData.map((item) => item.total),
        labels: debitTotalData.map((item) => item.descricao),
      }));
    }

    setDebitTotalIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debitEndDate, debitStartDate, dispatch, hasPermission, safras, selectedDebit]);

  const loadData = useCallback(() => {
    loadCreditTotal();
    loadDebitTotal();
  }, [loadCreditTotal, loadDebitTotal]);

  useImperativeHandle(ref, () => ({
    loadData
  }), [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    async function loadPlanoContas() {
      if (hasToFetch(chartAccountsList.lastFetch)) {
        const [creditChartAccountsData, debitChartAccountsData] = await Promise.all([
          PlanoContaService.findPlanoContas('receita', 'sintetica'),
          PlanoContaService.findPlanoContas('despesa', 'sintetica'),
        ]);

        const creditChartAccountsTree = parseChartAccounts(creditChartAccountsData);
        const debitChartAccountsTree = parseChartAccounts(debitChartAccountsData);

        dispatch(setChartAccountsData({
          credit: creditChartAccountsTree,
          debit: debitChartAccountsTree,
        }));
        dispatch(change({
          name: 'chartAccountsCreditSelected',
          value: creditChartAccountsTree[0]?.key || null,
        }));
        dispatch(change({
          name: 'chartAccountsDebitSelected',
          value: debitChartAccountsTree[0]?.key || null,
        }));
      }
    }

    loadPlanoContas();
  }, [chartAccountsList.lastFetch, dispatch]);

  function handleSaveChart(type: 'credit' | 'debit') {
    const chartElement = type === 'credit' ? creditChartRef.current : debitChartRef.current;
    const fileName = type === 'credit'
      ? `CRÉDITOS COMPENSADOS ${creditStartDate ? format(creditStartDate, 'dd-MM-yyyy') : '-'
      } À ${creditEndDate ? format(creditEndDate, 'dd-MM-yyyy') : '-'}`
      : `DÉBITOS COMPENSADOS ${debitStartDate ? format(debitStartDate, 'dd-MM-yyyy') : '-'
      } À ${debitEndDate ? format(debitEndDate, 'dd-MM-yyyy') : '-'}`;

    if (!chartElement) {
      return;
    }

    html2canvas(chartElement, {
      backgroundColor: null,
      imageTimeout: 0,
      scale: 2,
    }).then((canvas) => {
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = fileName;
      a.click();
    });
  }

  return (
    <Container>
      <Content>
        <header>
          <h3>DÉBITOS COMPENSADOS</h3>
          <div>
            <DateInput
              onChangeDate={(date) => {
                dispatch(change({
                  name: 'chartAccountsDebitRangeDates', value: {
                    startDate: date,
                    endDate: debitEndDate
                  }
                }));
              }}
              placeholder='Data Inicial'
              defaultDate={debitStartDate}
            />
            <strong>à</strong>
            <DateInput
              onChangeDate={(date) => {
                dispatch(change({
                  name: 'chartAccountsDebitRangeDates', value: {
                    startDate: debitStartDate,
                    endDate: date
                  }
                }));
              }}
              placeholder='Data Final'
              defaultDate={debitEndDate}
            />
          </div>
        </header>
        <div className="card" ref={debitChartRef}>
          {!hasPermission('debitos_compensados') && <NotAllowed />}
          {debitTotalIsLoading && (
            <Loader>
              <Spinner size={48} />
            </Loader>
          )}
          {hasPermission('debitos_compensados') && (
            <ChartAccountsSelect type='debit' />
          )}
          <ChartAccountsChart
            labels={debit.labels}
            data={debit.data}
          />
          {debit.data.length > 0 && (
            <footer data-html2canvas-ignore>
              <Link
                to={'movimento-contas/analitica?type=debit'}
              >
                Visão Detalhada
              </Link>
              <button onClick={() => handleSaveChart('debit')}>
                <DownloadSimple size={24} color="#F7FBFE" weight='regular' />
              </button>
            </footer>
          )}
        </div>
      </Content>
      <Content>
        <header>
          <h3>CRÉDITOS COMPENSADOS</h3>
          <div>
            <DateInput
              onChangeDate={(date) => {
                dispatch(change({
                  name: 'chartAccountsCreditRangeDates', value: {
                    startDate: date,
                    endDate: creditEndDate
                  }
                }));
              }}
              placeholder='Data Inicial'
              defaultDate={creditStartDate}
            />
            <strong>à</strong>
            <DateInput
              onChangeDate={(date) => {
                dispatch(change({
                  name: 'chartAccountsCreditRangeDates', value: {
                    startDate: creditStartDate,
                    endDate: date
                  }
                }));
              }}
              placeholder='Data Final'
              defaultDate={creditEndDate}
            />
          </div>
        </header>
        <div className="card" ref={creditChartRef}>
          {!hasPermission('creditos_compensados') && <NotAllowed />}
          {creditTotalIsLoading && (
            <Loader>
              <Spinner size={48} />
            </Loader>
          )}
          {hasPermission('creditos_compensados') && (
            <ChartAccountsSelect type='credit' />
          )}
          <ChartAccountsChart
            labels={credit.labels}
            data={credit.data}
          />
          {credit.data.length > 0 && (
            <footer data-html2canvas-ignore>
              <Link
                to={'movimento-contas/analitica?type=credit'}
              >
                Visão Detalhada
              </Link>
              <button onClick={() => handleSaveChart('credit')}>
                <DownloadSimple size={24} color="#F7FBFE" weight='regular' />
              </button>
            </footer>
          )}
        </div>
      </Content>
    </Container>
  );
});
