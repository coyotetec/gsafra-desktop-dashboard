import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartContainer, Container } from './styles';
import { ArrowLeft, ArrowRight } from 'phosphor-react';
import { useEffect, useMemo, useState } from 'react';
import { currencyFormat } from '../../../../utils/currencyFormat';
import emptyIllustration from '../../../../assets/images/empty.svg';

interface TalhaoCostChartProps {
  labels: string[];
  safras: string[];
  data: number[];
  unit: string;
}

const ITEMS_PER_PAGE = 7;

export function TalhaoCostChart({ labels, safras, data, unit }: TalhaoCostChartProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const dataToShow = useMemo(() => ({
    labels: labels.slice(currentPage * ITEMS_PER_PAGE, (currentPage * ITEMS_PER_PAGE) + ITEMS_PER_PAGE),
    safras: safras.slice(currentPage * ITEMS_PER_PAGE, (currentPage * ITEMS_PER_PAGE) + ITEMS_PER_PAGE),
    data: data.slice(currentPage * ITEMS_PER_PAGE, (currentPage * ITEMS_PER_PAGE) + ITEMS_PER_PAGE),
  }), [currentPage, labels, safras, data]);

  useEffect(() => {
    setCurrentPage(0);
  }, [data]);

  function getHigherValue(arr: number[]) {
    return arr.reduce((a, b) => {
      return Math.max(a, b);
    }, -Infinity);
  }

  function formatNumber(number: number, sufix?: string) {
    return `${new Intl.NumberFormat('id').format(number)}${sufix ? sufix : ''}`;
  }

  return (
    <Container>
      {data.length === 0 ? (
        <div className='empty'>
          <img src={emptyIllustration} alt="Ilustração de vazio" />
          <strong>Nenhum dado encontrado</strong>
          <span>Tente inserir outro intervalo de datas.</span>
        </div>
      ) : (
        <ChartContainer>
          <Bar
            data={{
              labels: dataToShow.labels.map(i => `${i.slice(0, 40)}${i.length > 40 ? '...' : ''}`),
              datasets: [
                {
                  label: 'Total',
                  data: dataToShow.data,
                  backgroundColor: [
                    '#00e676',
                    '#2979ff',
                    '#ffc400',
                    '#ff3d00',
                    '#e91e63',
                    '#9c27b0',
                    '#5C6BC0',
                  ],
                  barThickness: 12,
                },
              ]
            }}
            plugins={[ChartDataLabels]}
            options={{
              indexAxis: 'y',
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  beginAtZero: true,
                  display: false,
                  grid: {
                    display: false
                  },
                  min: 0,
                  max: getHigherValue(dataToShow.data) * 1.5,
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    font: {
                      size: 12,
                    },
                  },
                }
              },
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label(ctx) {
                      return dataToShow.safras[ctx.dataIndex];
                    },
                    title([ctx]) {
                      return dataToShow.labels[ctx.dataIndex];
                    }
                  }
                },
                datalabels: {
                  align: 'end',
                  textAlign: 'left',
                  anchor: 'end',
                  font: {
                    weight: 600,
                  },
                  formatter(value) {
                    switch (unit) {
                    case 'cost':
                      return currencyFormat(value);
                    case 'hectareCost':
                      return `${currencyFormat(value)}/ha`;
                    default:
                      return formatNumber(value, '%');
                    }
                  },
                }
              },
            }}
          />
        </ChartContainer>
      )}
      {data.length > ITEMS_PER_PAGE && (
        <footer>
          {currentPage > 0 && (
            <button
              aria-label='página anterior'
              onClick={() => setCurrentPage((prevState) => prevState - 1)}
            >
              <ArrowLeft size={20} color="#F7FBFE" weight='regular' />
            </button>
          )}

          {((currentPage * ITEMS_PER_PAGE) + ITEMS_PER_PAGE) < data.length && (
            <button
              aria-label='próxima página'
              onClick={() => setCurrentPage((prevState) => prevState + 1)}
            >
              <ArrowRight size={20} color="#F7FBFE" weight='regular' />
            </button>
          )}
        </footer>
      )}
    </Container>
  );
}
