import html2canvas from 'html2canvas';
import { DownloadSimple } from 'phosphor-react';
import { useRef } from 'react';
import { NotAllowed } from '../../../../components/NotAllowed';
import { Spinner } from '../../../../components/Spinner';
import { useUserContext } from '../../../../contexts/UserContext';
import { currencyFormat } from '../../../../utils/currencyFormat';
import { FuelReviewChart } from '../FuelReviewChart';
import { Container, Loader } from './styles';

interface FuelReviewProps {
  title: string;
  isLoading: boolean;
  total: number;
  labels: string[];
  data: number[];
  isCurrency?: boolean;
}

export function FuelReview({
  title,
  total,
  labels,
  data,
  isCurrency,
  isLoading,
}: FuelReviewProps) {
  const chartRef = useRef(null);
  const { hasPermission } = useUserContext();

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
      a.download = `RESUMO DE ABASTECIMENTO POR COMBUSTIVEL - ${title}`;
      a.click();
    });
  }

  function formatNumber(number: number) {
    return `${new Intl.NumberFormat('id').format(number)} lts`;
  }

  return (
    <Container>
      <h3>{title}</h3>
      <div className="card" ref={chartRef}>
        {!hasPermission('resumo_combustivel_abastecimento') && <NotAllowed />}
        {isLoading && (
          <Loader>
            <Spinner size={48} />
          </Loader>
        )}
        <header>
          <div>
            <strong>Total: </strong>
            <span>
              {isCurrency ? currencyFormat(total) : formatNumber(total)}
            </span>
          </div>
          <button onClick={handleSaveChart} data-html2canvas-ignore>
            <DownloadSimple size={24} color="#F7FBFE" weight="regular" />
          </button>
        </header>
        <FuelReviewChart
          labels={labels}
          data={data}
          isCurrency={isCurrency}
          total={total}
        />
      </div>
    </Container>
  );
}
