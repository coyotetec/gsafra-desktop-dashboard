import { Line } from 'react-chartjs-2';
import { ChartContainer, Container } from './styles';
import emptyIllustration from '../../../../assets/images/empty.svg';
import { currencyFormat } from '../../../../utils/currencyFormat';

interface MonthlyAvarageChartProps {
  labels: string[];
  data: number[];
  unit: string;
}

export function MonthlyAvarageChart({ labels, data, unit }: MonthlyAvarageChartProps) {
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
          <Line
            data={{
              labels: labels,
              datasets: [
                {
                  data: data,
                  backgroundColor: '#1890FF',
                  borderColor: '#1890FF',
                  borderWidth: 3,
                  spanGaps: true,
                },
              ]
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
                    maxTicksLimit: 12
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
                      return `${currencyFormat(context.parsed.y)}/${unit === 'sacks' ? 'Saca' : 'Kg'}`;
                    }
                  }
                },
              },
            }}
          />
        </ChartContainer>
      )}
    </Container>
  );
}
