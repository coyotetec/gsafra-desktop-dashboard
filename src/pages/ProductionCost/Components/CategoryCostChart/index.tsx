// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Container } from './styles';
import { currencyFormat } from '../../../../utils/currencyFormat';

import emptyIllustration from '../../../../assets/images/empty.svg';
import { useMemo } from 'react';

interface CategoryCostChartProps {
  labels: string[];
  data: number[];
  percentages: number[];
  unit: string;
}

export function CategoryCostChart({
  labels,
  data,
  percentages,
  unit,
}: CategoryCostChartProps) {
  const dataSum = useMemo(
    () => data.reduce((acc, curr) => acc + curr, 0),
    [data],
  );

  return (
    <Container>
      {data.length === 0 || dataSum === 0 ? (
        <div className="empty">
          <img src={emptyIllustration} alt="Ilustração de vazio" />
          <strong>Nenhum dado encontrado</strong>
          <span>Tente inserir outro intervalo de datas.</span>
        </div>
      ) : (
        <Pie
          data={{
            labels,
            datasets: [
              {
                data,
                backgroundColor: [
                  'rgba(0, 230, 118, 0.5)',
                  'rgba(41, 121, 255, 0.5)',
                  'rgba(255, 196, 0, 0.5)',
                  'rgba(255, 61, 0, 0.5)',
                  'rgba(233, 30, 99, 0.5)',
                  'rgba(156, 39, 176, 0.5)',
                  'rgba(92, 107, 192, 0.5)',
                ],
                borderColor: [
                  '#00e676',
                  '#2979ff',
                  '#ffc400',
                  '#ff3d00',
                  '#e91e63',
                  '#9c27b0',
                  '#5C6BC0',
                ],
                borderWidth: 2,
              },
            ],
          }}
          plugins={[ChartDataLabels]}
          options={{
            responsive: true,
            maintainAspectRatio: false,
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
                    if (context.parsed !== null) {
                      label += currencyFormat(context.parsed);
                    }
                    return `${label}${unit === 'hectareCost' ? '/ha' : ''}`;
                  },
                },
              },
              datalabels: {
                display(ctx) {
                  const percentage = percentages[ctx.dataIndex];
                  return percentage > 2;
                },
                font: {
                  weight: 600,
                  size: 16,
                },
                formatter(value, ctx) {
                  const percentage = percentages[ctx.dataIndex];
                  const parsedPercentage = new Intl.NumberFormat('id', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(percentage);

                  return `${parsedPercentage}%`;
                },
              },
            },
          }}
        />
      )}
    </Container>
  );
}
