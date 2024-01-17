import { Bar } from 'react-chartjs-2';
import { Container } from './styles';
import { currencyFormat } from '../../../../utils/currencyFormat';

import emptyIllustration from '../../../../assets/images/empty.svg';

interface MonthlyReviewChartProps {
  labels: string[];
  data: number[];
  isCurrency?: boolean;
  color?: string;
}

export function MonthlyReviewChart({
  labels,
  data,
  isCurrency = false,
  color = '#2979ff',
}: MonthlyReviewChartProps) {
  function formatNumber(number: number) {
    return `${new Intl.NumberFormat('id').format(number)} lts`;
  }

  return (
    <Container>
      {data.length === 0 ? (
        <div className="empty">
          <img src={emptyIllustration} alt="Ilustração de vazio" />
          <strong>Nenhum dado encontrado</strong>
          <span>Tente inserir outro intervalo de datas.</span>
        </div>
      ) : (
        <Bar
          data={{
            labels,
            datasets: [
              {
                data,
                backgroundColor: color,
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
                    return isCurrency
                      ? currencyFormat(Number(tickValue), 3)
                      : formatNumber(Number(tickValue));
                  },
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    let label = context.dataset.label || '';

                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed.y !== null) {
                      label += isCurrency
                        ? currencyFormat(context.parsed.y, 3)
                        : formatNumber(context.parsed.y);
                    }
                    return label;
                  },
                },
              },
            },
          }}
        />
      )}
    </Container>
  );
}
