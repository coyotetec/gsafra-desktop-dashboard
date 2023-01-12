import { format, startOfMonth, startOfYear, subMonths } from 'date-fns';
import html2canvas from 'html2canvas';
import { DownloadSimple } from 'phosphor-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../../components/App';
import { DateInput } from '../../../../components/DateInput';
import { NotAllowed } from '../../../../components/NotAllowed';
import { Spinner } from '../../../../components/Spinner';
import FinancialViewsService from '../../../../services/FinancialViewsService';
import { View, ViewTotal, ViewTotalizer } from '../../../../types/FinancialViews';
import { currencyFormat } from '../../../../utils/currencyFormat';
import { FinancialViewChart } from '../FinancialViewChart';
import { Container, Loader } from './styles';

interface RangeDates {
  startDate: Date | null;
  endDate: Date | null;
}

type FinancialViewProps = View

export function FinancialView({ id, nome, periodoPadraoMeses }: FinancialViewProps) {
  const [labels, setLabels] = useState<string[]>([]);
  const [total, setTotal] = useState<number[]>([]);
  const [data, setData] = useState<ViewTotal[]>([]);
  const [totalizers, setTotalizers] = useState<ViewTotalizer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rangeDates, setRangeDates] = useState<RangeDates>({
    startDate: periodoPadraoMeses === 0
      ? startOfMonth(new Date())
      : periodoPadraoMeses === -2
        ? startOfYear(new Date())
        : periodoPadraoMeses === -1
          ? null
          : subMonths(new Date(), periodoPadraoMeses),
    endDate: periodoPadraoMeses === -1 ? null : new Date(),
  });
  const chartRef = useRef(null);

  const { hasPermission } = useContext(UserContext);

  useEffect(() => {
    async function loadData() {
      if (hasPermission('indicadores_financeiros')) {
        setIsLoading(true);

        if (rangeDates.endDate && rangeDates.startDate && rangeDates.endDate < rangeDates.startDate) {
          setIsLoading(false);
          return;
        }

        const startDateParsed = rangeDates.startDate ? format(rangeDates.startDate, 'dd-MM-yyyy') : '';
        const endDateParsed = rangeDates.endDate ? format(rangeDates.endDate, 'dd-MM-yyyy') : '';

        const viewTotalData = await FinancialViewsService.findViewTotal(
          id,
          startDateParsed,
          endDateParsed
        );

        setLabels(viewTotalData.data.reduce((result, item) => {
          if (item.visivel) {
            result.push(item.nome);
          }
          return result;
        }, [] as string[]));
        setTotal(viewTotalData.data.reduce((result, item) => {
          if (item.visivel) {
            result.push(item.total);
          }
          return result;
        }, [] as number[]));
        setData(viewTotalData.data);
        setTotalizers(viewTotalData.totalizadores);

      }
      setIsLoading(false);
    }

    loadData();
  }, [hasPermission, id, rangeDates]);

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
            onChangeDate={(date) => setRangeDates((prevState) => ({
              ...prevState,
              startDate: date
            }))}
            placeholder='Data Inicial'
            defaultDate={periodoPadraoMeses === 0
              ? startOfMonth(new Date())
              : periodoPadraoMeses === -2
                ? startOfYear(new Date())
                : periodoPadraoMeses === -1
                  ? null
                  : subMonths(new Date(), periodoPadraoMeses)}
          />
          <strong>à</strong>
          <DateInput
            onChangeDate={(date) => setRangeDates((prevState) => ({
              ...prevState,
              endDate: date
            }))}
            placeholder='Data Final'
            defaultDate={periodoPadraoMeses === -1 ? null : new Date()}
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
        <FinancialViewChart allData={data} labels={labels} data={total} />
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
