import { format, subMonths } from 'date-fns';
import html2canvas from 'html2canvas';
import { DownloadSimple } from 'phosphor-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../../components/App';
import { DateInput } from '../../../../components/DateInput';
import { NotAllowed } from '../../../../components/NotAllowed';
import FinancialViewsService from '../../../../services/FinancialViewsService';
import { View } from '../../../../types/FinancialViews';
import { FinancialViewChart } from '../FinancialViewChart';
import { Container } from './styles';

interface RangeDates {
  startDate: Date;
  endDate: Date;
}

type FinancialViewProps = View

export function FinancialView({ id, nome, }: FinancialViewProps) {
  const [labels, setLabels] = useState<string[]>([]);
  const [total, setTotal] = useState<number[]>([]);
  const [rangeDates, setRangeDates] = useState<RangeDates>({
    startDate: subMonths(new Date(), 12),
    endDate: new Date(),
  });
  const chartRef = useRef(null);

  const { hasPermission } = useContext(UserContext);

  useEffect(() => {
    async function loadData() {
      if (hasPermission('indicadores_financeiros')) {
        if (!rangeDates.startDate || !rangeDates.endDate) {
          return;
        }

        if (rangeDates.endDate < rangeDates.startDate) {
          return;
        }

        const startDateParsed = format(rangeDates.startDate, 'dd-MM-yyyy');
        const endDateParsed = format(rangeDates.endDate, 'dd-MM-yyyy');

        const viewTotalData = await FinancialViewsService.findViewTotal(
          id,
          startDateParsed,
          endDateParsed
        );

        setLabels(viewTotalData.map((item) => item.nome));
        setTotal(viewTotalData.map((item) => item.total));
      }
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
      a.download = `${nome} ${format(rangeDates.startDate, 'dd-MM-yyyy')} À ${format(rangeDates.endDate, 'dd-MM-yyyy')}`;
      a.click();
    });
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
            defaultDate={subMonths(new Date(), 12)}
          />
          <strong>à</strong>
          <DateInput
            onChangeDate={(date) => setRangeDates((prevState) => ({
              ...prevState,
              endDate: date
            }))}
            placeholder='Data Final'
            defaultDate={new Date()}
          />
        </div>
      </header>
      <div className="card" ref={chartRef}>
        {!hasPermission('indicadores_financeiros') && <NotAllowed />}
        <FinancialViewChart labels={labels} data={total} />
        <footer data-html2canvas-ignore>
          <Link
            to={`${id}?startDate=${format(rangeDates.startDate, 'dd-MM-yyyy')
            }&endDate=${format(rangeDates.endDate, 'dd-MM-yyyy')
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
