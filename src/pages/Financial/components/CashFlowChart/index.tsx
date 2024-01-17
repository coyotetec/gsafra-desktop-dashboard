import { Chart } from 'react-chartjs-2';
import html2canvas from 'html2canvas';

import { Container, Loader } from './styles';

import { currencyFormat } from '../../../../utils/currencyFormat';
import { CashFlow, CashFlowPattern } from '../../../../types/Financial';
import { NotAllowed } from '../../../../components/NotAllowed';
import { useRef } from 'react';
import { DownloadSimple } from 'phosphor-react';
import { format } from 'date-fns';
import { Spinner } from '../../../../components/Spinner';
import emptyIllustration from '../../../../assets/images/empty.svg';
import { useUserContext } from '../../../../contexts/UserContext';

interface CashFlowChartProps {
  labels: string[];
  cashFlow: CashFlow;
  startDate: Date | null;
  endDate: Date | null;
  isLoading: boolean;
}

export function CashFlowChart({
  labels,
  cashFlow,
  startDate,
  endDate,
  isLoading,
}: CashFlowChartProps) {
  const chartRef = useRef(null);

  const { hasPermission } = useUserContext();

  function getCashFlowItemData(data: CashFlowPattern[]) {
    return data ? data.map((i) => i.value) : [];
  }

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
      a.download = `FLUXO DE CAIXA ${
        startDate ? format(startDate, 'dd-MM-yyyy') : '-'
      } À ${endDate ? format(endDate, 'dd-MM-yyyy') : '-'}`;
      a.click();
    });
  }

  return (
    <Container ref={chartRef}>
      {!hasPermission('fluxo_caixa') && <NotAllowed />}
      {isLoading && (
        <Loader>
          <Spinner size={48} />
        </Loader>
      )}
      <header>
        <div>
          <strong>Saldo Inicial: </strong>
          <span>{currencyFormat(cashFlow.currentBalance || 0)}</span>
        </div>
        <button onClick={handleSaveChart} data-html2canvas-ignore>
          <DownloadSimple size={24} color="#F7FBFE" weight="regular" />
        </button>
      </header>
      {cashFlow.hasError ? (
        <div className="empty">
          <img src={emptyIllustration} alt="Ilustração de vazio" />
          <strong>Nenhum dado encontrado</strong>
          <span>Tente inserir outro intervalo de datas.</span>
        </div>
      ) : (
        <div className="chart-container">
          <Chart
            type="bar"
            data={{
              labels,
              datasets: [
                {
                  type: 'bar' as const,
                  label: 'Créditos',
                  data: getCashFlowItemData(cashFlow.cashFlowCredits),
                  backgroundColor: '#00D47E',
                },
                {
                  type: 'bar' as const,
                  label: 'Créditos Planejados',
                  data: getCashFlowItemData(cashFlow.cashFlowCreditsPlan),
                  backgroundColor: 'rgba(0, 212, 126, 0.5)',
                  borderColor: '#00D47E',
                  borderWidth: 2,
                },
                {
                  type: 'bar' as const,
                  label: 'Débitos',
                  data: getCashFlowItemData(cashFlow.cashFlowDebits),
                  backgroundColor: '#FF5555',
                },
                {
                  type: 'bar' as const,
                  label: 'Débitos Planejados',
                  data: getCashFlowItemData(cashFlow.cashFlowDebitsPlan),
                  backgroundColor: 'rgba(255, 85, 85, 0.5)',
                  borderColor: '#FF5555',
                  borderWidth: 2,
                },
                {
                  type: 'line' as const,
                  label: 'Balanço',
                  data: getCashFlowItemData(cashFlow.cashFlowBalance),
                  backgroundColor: '#1890FF',
                  borderColor: '#1890FF',
                  borderWidth: 2,
                },
                {
                  type: 'line' as const,
                  label: 'Balanço Planejado',
                  data: getCashFlowItemData(cashFlow.cashFlowBalancePlan),
                  backgroundColor: 'rgba(24, 144, 255, 0.5)',
                  borderColor: 'rgba(24, 144, 255, 0.4)',
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback(this, tickValue) {
                      return currencyFormat(Number(tickValue));
                    },
                    maxTicksLimit: 12,
                  },
                },
              },
              plugins: {
                legend: {
                  align: 'center',
                  position: 'bottom',
                },

                tooltip: {
                  callbacks: {
                    label: function (context) {
                      let label = context.dataset.label || '';

                      if (label) {
                        label += ': ';
                      }
                      if (context.parsed.y !== null) {
                        label += currencyFormat(context.parsed.y);
                      }
                      return label;
                    },
                  },
                },
              },
            }}
          />
        </div>
      )}
    </Container>
  );
}
