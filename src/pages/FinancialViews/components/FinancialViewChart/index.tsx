import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartContainer, Container } from './styles';

import { currencyFormat } from '../../../../utils/currencyFormat';

import emptyIllustration from '../../../../assets/images/empty.svg';
import { ArrowLeft, ArrowRight } from 'phosphor-react';
import { useEffect, useMemo, useState } from 'react';
import { ViewTotal } from '../../../../types/FinancialViews';

interface FinancialViewChartProps {
  labels: string[];
  data: number[];
  allData: ViewTotal[];
}

export function FinancialViewChart({ allData, labels, data }: FinancialViewChartProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const dataToShow = useMemo(() => ({
    labels: labels.slice(currentPage * 7, (currentPage * 7) + 7),
    data: data.slice(currentPage * 7, (currentPage * 7) + 7)
  }), [currentPage, labels, data]);

  useEffect(() => {
    setCurrentPage(0);
  }, [data]);

  const higherValue = useMemo(() => {
    return dataToShow.data.reduce((a, b) => {
      return Math.max(a, b);
    }, -Infinity);
  }, [dataToShow]);

  return (
    <Container>
      {dataToShow.data.length === 0 ? (
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
                }
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
                  stacked: true,
                  min: 0,
                  max: higherValue <= 0 ? 1 : higherValue * 1.5
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
                  // enabled: false,
                },
                datalabels: {
                  align: 'end',
                  textAlign: 'left',
                  anchor: 'end',
                  color(context) {
                    const item = allData[context.dataIndex];

                    return item.totalReal < 0 ? '#FF5555' : '#CFD4D6';
                  },
                  font: {
                    weight: 600,
                  },
                  formatter(value) {
                    const item = allData.find((i) => i.total === value);

                    return currencyFormat(item?.totalReal || 0);
                  },
                }
              },
            }}
          />
        </ChartContainer>
      )}
      {data.length > 7 && (
        <footer>
          {currentPage > 0 && (
            <button
              aria-label='página anterior'
              onClick={() => setCurrentPage((prevState) => prevState - 1)}
            >
              <ArrowLeft size={20} color="#F7FBFE" weight='regular' />
            </button>
          )}

          {((currentPage * 7) + 7) < data.length && (
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
