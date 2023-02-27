import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartContainer, Container } from './styles';
import { ArrowLeft, ArrowRight } from 'phosphor-react';
import { useEffect, useMemo, useState } from 'react';
import emptyIllustration from '../../../../assets/images/empty.svg';
import { currencyFormat } from '../../../../utils/currencyFormat';

interface ClientAvarageChartProps {
  labels: string[];
  data: number[];
  unit: string;
}

const ITEMS_PER_PAGE = 7;

export function ClientAvarageChart({ labels, data, unit }: ClientAvarageChartProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const dataToShow = useMemo(() => ({
    labels: labels.slice(currentPage * ITEMS_PER_PAGE, (currentPage * ITEMS_PER_PAGE) + ITEMS_PER_PAGE),
    data: data.slice(currentPage * ITEMS_PER_PAGE, (currentPage * ITEMS_PER_PAGE) + ITEMS_PER_PAGE),
  }), [currentPage, labels, data]);

  useEffect(() => {
    setCurrentPage(0);
  }, [data]);

  function getHigherValue(arr: number[]) {
    return arr.reduce((a, b) => {
      return Math.max(a, b);
    }, -Infinity);
  }

  return (
    <Container>
      {data.length === 0 ? (
        <div className='empty'>
          <img src={emptyIllustration} alt="Ilustração de vazio" />
          <strong>Nenhum dado encontrado</strong>
          <span>Tente selecionar outra safra.</span>
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
                  enabled: false,
                },
                datalabels: {
                  align: 'end',
                  textAlign: 'left',
                  anchor: 'end',
                  font: {
                    weight: 600,
                  },
                  formatter(value) {
                    return `${currencyFormat(value)}/${unit === 'sacks' ? 'Saca' : 'Kg'}`;
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
