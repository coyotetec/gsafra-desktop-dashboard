import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import { DownloadSimple } from 'phosphor-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { DateInput } from '../../../../components/DateInput';
import { NotAllowed } from '../../../../components/NotAllowed';
import { Spinner } from '../../../../components/Spinner';
import { useUserContext } from '../../../../contexts/UserContext';
import {
  changeView,
  FinancialView as FinancialViewType
} from '../../../../redux/features/financialViewsDataSlice';
import FinancialViewsService from '../../../../services/FinancialViewsService';
import { currencyFormat } from '../../../../utils/currencyFormat';
import { hasToFetch } from '../../../../utils/hasToFetch';
import { toast } from '../../../../utils/toast';
import { FinancialViewChart } from '../FinancialViewChart';
import { Container, Loader } from './styles';

type FinancialViewProps = FinancialViewType;

export function FinancialView({
  id,
  nome,
  rangeDates,
  periodoPadraoMeses,
  lastFetch,
  totalizers,
  total
}: FinancialViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);
  const isFirstRender = useRef(true);

  const dispatch = useDispatch();

  const { hasPermission } = useUserContext();

  useEffect(() => {
    async function loadData() {
      if (hasPermission('indicadores_financeiros')) {
        setIsLoading(true);

        if (isFirstRender.current) {
          isFirstRender.current = false;

          if (!hasToFetch(lastFetch)) {
            setIsLoading(false);
            return;
          }
        }

        if (rangeDates.endDate && rangeDates.startDate && rangeDates.endDate < rangeDates.startDate) {
          setIsLoading(false);
          dispatch(changeView({
            id,
            name: 'total',
            value: []
          }));
          dispatch(changeView({
            id,
            name: 'totalizers',
            value: []
          }));
          toast({
            type: 'danger',
            text: 'Data final precisa ser maior que inicial!'
          });
          return;
        }

        const startDateParsed = rangeDates.startDate ? format(rangeDates.startDate, 'dd-MM-yyyy') : '';
        const endDateParsed = rangeDates.endDate ? format(rangeDates.endDate, 'dd-MM-yyyy') : '';

        const viewTotalData = await FinancialViewsService.findViewTotal(
          id,
          startDateParsed,
          endDateParsed
        );

        dispatch(changeView({
          id,
          name: 'total',
          value: viewTotalData.data
        }));
        dispatch(changeView({
          id,
          name: 'totalizers',
          value: viewTotalData.totalizadores
        }));
      }
      setIsLoading(false);
    }

    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPermission, id, rangeDates, dispatch]);

  function handleSaveChart() {
    const chartElement = chartRef.current;

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
      a.target = '_blank';
      a.download = `${nome} ${periodoPadraoMeses === 0
        ? 'Mês Atual'
        : periodoPadraoMeses === -1
          ? 'Todos os Lançamentos'
          : `${rangeDates.startDate && format(rangeDates.startDate, 'dd-MM-yyyy')} À ${rangeDates.endDate && format(rangeDates.endDate, 'dd-MM-yyyy')}`}`;
      a.click();
    });
  }

  function formatNumber(number: number) {
    return new Intl.NumberFormat('id').format(number);
  }

  return (
    <Container>
      <header>
        <h3>{nome}</h3>
        <div>
          <DateInput
            onChangeDate={(date) => {
              dispatch(changeView({
                id,
                name: 'rangeDates',
                value: {
                  startDate: date,
                  endDate: rangeDates.endDate
                }
              }));
            }}
            placeholder='Data Inicial'
            defaultDate={rangeDates.startDate}
          />
          <strong>à</strong>
          <DateInput
            onChangeDate={(date) => {
              dispatch(changeView({
                id,
                name: 'rangeDates',
                value: {
                  startDate: rangeDates.startDate,
                  endDate: date
                }
              }));
            }}
            placeholder='Data Final'
            defaultDate={rangeDates.endDate}
          />
        </div>
      </header>
      <div className="card" ref={chartRef}>
        {!hasPermission('indicadores_financeiros') && <NotAllowed />}
        {isLoading && (
          <Loader>
            <Spinner size={48} />
          </Loader>
        )}
        <FinancialViewChart
          allData={total}
          labels={total.reduce((result, item) => {
            if (item.visivel) {
              result.push(item.nome);
            }
            return result;
          }, [] as string[])}
          data={total.reduce((result, item) => {
            if (item.visivel) {
              result.push(item.total);
            }
            return result;
          }, [] as number[])}
        />
        <div className="totalizers">
          {totalizers.map((totalizer) => (
            <div
              key={totalizer.nome}
              className={`totalizer-item ${totalizer.error && 'has-error'} ${Number(totalizer.total) < 0 && 'negative'}`}
            >
              <strong>{totalizer.nome}: </strong>
              {totalizer.error && <span>{totalizer.error}</span>}
              {totalizer.formato === 1 && <span>{currencyFormat(Number(totalizer.total))}</span>}
              {totalizer.formato === 2 && <span>{formatNumber(Number(totalizer.total))}%</span>}
              {totalizer.formato === 3 || totalizer.formato === null && <span>{formatNumber(Number(totalizer.total))}</span>}
            </div>
          ))}
        </div>
        <footer data-html2canvas-ignore>
          <Link
            to={`${id}?startDate=${rangeDates.startDate ? format(rangeDates.startDate, 'dd-MM-yyyy') : '_'
            }&endDate=${rangeDates.endDate ? format(rangeDates.endDate, 'dd-MM-yyyy') : '_'
            }&name=${nome}`}
          >
            Visão Detalhada
          </Link>
          <button onClick={handleSaveChart}>
            <DownloadSimple size={24} color="#F7FBFE" weight='regular' />
          </button>
        </footer>
      </div>
    </Container>
  );
}
