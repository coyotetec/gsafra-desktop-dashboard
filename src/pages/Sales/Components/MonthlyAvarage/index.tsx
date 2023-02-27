import { useContext, useEffect, useRef, useState } from 'react';
import { Spinner } from '../../../../components/Spinner';
import { Container, Loader } from './styles';
import { Switch } from '../../../../components/Switch';
import VendaService from '../../../../services/VendaService';
import { format } from 'date-fns';
import { toast } from '../../../../utils/toast';
import { MediaMes } from '../../../../types/Venda';
import { MonthlyAvarageChart } from '../MonthlyAvarageChart';
import { DownloadSimple } from 'phosphor-react';
import html2canvas from 'html2canvas';
import { currencyFormat } from '../../../../utils/currencyFormat';
import { UserContext } from '../../../../components/App';
import { NotAllowed } from '../../../../components/NotAllowed';

interface RangeDates {
  startDate: Date | null;
  endDate: Date | null;
}

interface MonthlyAvarageProps {
  safraId: string;
  safraName: string;
  deliveryStatus: string;
  rangeDates: RangeDates;
}

export function MonthlyAvarage({ safraId, safraName, deliveryStatus, rangeDates }: MonthlyAvarageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [unit, setUnit] = useState<'kg' | 'sacks'>('sacks');
  const [monthlyAvarage, setMonthlyAvarage] = useState<MediaMes>({
    mediaSafraKg: 0,
    mediaSafraSaca: 0,
    mediaMes: []
  });
  const chartRef = useRef(null);

  const { hasPermission } = useContext(UserContext);

  useEffect(() => {
    async function loadData() {
      if (hasPermission('vendas_preco_medio_por_mes')) {
        setIsLoading(true);

        if (safraId === '_') {
          setIsLoading(false);
          return;
        }

        if (rangeDates.endDate && rangeDates.startDate && rangeDates.endDate < rangeDates.startDate) {
          setIsLoading(false);
          toast({
            type: 'danger',
            text: 'Data final precisa ser maior que inicial!'
          });
          return;
        }

        const deliveryStatusParsed = deliveryStatus !== '_' ? deliveryStatus : '';
        const startDateParsed = rangeDates.startDate ? format(rangeDates.startDate, 'dd-MM-yyyy') : '';
        const endDateParsed = rangeDates.endDate ? format(rangeDates.endDate, 'dd-MM-yyyy') : '';

        const monthlyAvarageData = await VendaService.findMediaMes({
          safraId: Number(safraId),
          deliveryStatus: deliveryStatusParsed,
          startDate: startDateParsed,
          endDate: endDateParsed,
        });

        setMonthlyAvarage(monthlyAvarageData);
      }
      setIsLoading(false);
    }

    loadData();
  }, [safraId, deliveryStatus, rangeDates, hasPermission]);

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
      a.download = `PREÇO MÉDIO POR MÊS - ${safraName}`;
      a.click();
    });
  }


  return (
    <Container>
      <header>
        <h3>PREÇO MÉDIO POR MÊS</h3>
      </header>
      <div className="card" ref={chartRef}>
        {!hasPermission('vendas_preco_medio_por_mes') && <NotAllowed />}
        {isLoading && (
          <Loader>
            <Spinner size={48} />
          </Loader>
        )}
        <header data-html2canvas-ignore>
          <div className="total">
            <span>
              <strong>Preço Médio do Kg: </strong>
              {currencyFormat(monthlyAvarage.mediaSafraKg)}
            </span>
            <span>
              <strong>Preço Médio da Saca: </strong>
              {currencyFormat(monthlyAvarage.mediaSafraSaca)}
            </span>
          </div>
          <div className='left-side'>
            <Switch
              leftLabel="Saca"
              rightLabel="Kg"
              isToggled={unit === 'kg'}
              onToggle={(e) => { setUnit(e.target.checked ? 'kg' : 'sacks'); }}
            />
            <button onClick={handleSaveChart}>
              <DownloadSimple size={24} color="#F7FBFE" weight='regular' />
            </button>
          </div>
        </header>
        <MonthlyAvarageChart
          labels={monthlyAvarage.mediaMes.map(i => i.mes)}
          data={monthlyAvarage.mediaMes.map(i => unit === 'sacks' ? i.precoMedioSaca : i.precoMedioKg)}
          unit={unit}
        />
      </div>
    </Container>
  );
}
