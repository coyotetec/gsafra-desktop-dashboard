import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartContainer, Container } from './styles';

import { currencyFormat } from '../../../../utils/currencyFormat';

import emptyIllustration from '../../../../assets/images/empty.svg';
import { ArrowLeft, ArrowRight } from 'phosphor-react';
import { useEffect, useMemo, useState } from 'react';

interface ChartAccountsChartProps {
  labels: string[];
  data: number[];
}

export function ChartAccountsChart({ labels, data }: ChartAccountsChartProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const dataToShow = useMemo(
    () => ({
      labels: labels.slice(currentPage * 7, currentPage * 7 + 7),
      data: data.slice(currentPage * 7, currentPage * 7 + 7),
    }),
    [currentPage, labels, data],
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [data]);

  return (
    <Container>
      {dataToShow.data.length === 0 ? (
        <div className="empty">
          <img src={emptyIllustration} alt="Ilustração de vazio" />
          <strong>Nenhum dado encontrado</strong>
          <span>Tente selecionar outro plano de contas.</span>
        </div>
      ) : (
        <ChartContainer>
          <Bar
            data={{
              labels: dataToShow.labels.map(
                (i) => `${i.slice(0, 20)}${i.length > 20 ? '...' : ''}`,
              ),
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
                },
              ],
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
                    display: false,
                  },
                  stacked: true,
                  min: 0,
                  max: dataToShow.data[0] ? dataToShow.data[0] * 1.7 : 1,
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    font: {
                      size: 12,
                    },
                  },
                },
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
                    return currencyFormat(value);
                  },
                },
              },
            }}
          />
        </ChartContainer>
      )}
      {data.length > 7 && (
        <footer data-html2canvas-ignore>
          {currentPage > 0 && (
            <button
              aria-label="página anterior"
              onClick={() => setCurrentPage((prevState) => prevState - 1)}
            >
              <ArrowLeft size={20} color="#F7FBFE" weight="regular" />
            </button>
          )}

          {currentPage * 7 + 7 < data.length && (
            <button
              aria-label="próxima página"
              onClick={() => setCurrentPage((prevState) => prevState + 1)}
            >
              <ArrowRight size={20} color="#F7FBFE" weight="regular" />
            </button>
          )}
        </footer>
      )}
    </Container>
  );
}
