import { useEffect, useRef, useState } from 'react';
import { Spinner } from '../../../../components/Spinner';
import { Container, Loader } from './styles';
import { Switch } from '../../../../components/Switch';
import VendaService from '../../../../services/VendaService';
import { format } from 'date-fns';
import { toast } from '../../../../utils/toast';
import { MediaCliente } from '../../../../types/Venda';
import { ClientAvarageChart } from '../ClientAvarageChart';
import { DownloadSimple } from 'phosphor-react';
import html2canvas from 'html2canvas';
import { NotAllowed } from '../../../../components/NotAllowed';
import { useUserContext } from '../../../../contexts/UserContext';

interface RangeDates {
  startDate: Date | null;
  endDate: Date | null;
}

interface ClientAvarageProps {
  safraId: string;
  safraName: string;
  deliveryStatus: string;
  rangeDates: RangeDates;
}

export function ClientAvarage({ safraId, safraName, deliveryStatus, rangeDates }: ClientAvarageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [unit, setUnit] = useState<'kg' | 'sacks'>('sacks');
  const [clientAvarage, setClientAvarage] = useState<MediaCliente[]>([]);
  const chartRef = useRef(null);

  const { hasPermission } = useUserContext();

  useEffect(() => {
    async function loadData() {
      if (hasPermission('vendas_preco_medio_por_cliente')) {
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

        const clientAvarageData = await VendaService.findMediaCliente({
          safraId: Number(safraId),
          deliveryStatus: deliveryStatusParsed,
          startDate: startDateParsed,
          endDate: endDateParsed,
        });

        setClientAvarage(clientAvarageData);
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
      a.download = `PREÇO MÉDIO POR CLIENTE - ${safraName}`;
      a.click();
    });
  }

  return (
    <Container>
      <header>
        <h3>PREÇO MÉDIO POR CLIENTE</h3>
      </header>
      <div className="card" ref={chartRef}>
        {!hasPermission('vendas_preco_medio_por_cliente') && <NotAllowed />}
        {isLoading && (
          <Loader>
            <Spinner size={48} />
          </Loader>
        )}
        <header data-html2canvas-ignore>
          <Switch
            leftLabel="Saca"
            rightLabel="Kg"
            isToggled={unit === 'kg'}
            onToggle={(e) => { setUnit(e.target.checked ? 'kg' : 'sacks'); }}
          />
          <button onClick={handleSaveChart}>
            <DownloadSimple size={24} color="#F7FBFE" weight='regular' />
          </button>
        </header>
        <ClientAvarageChart
          labels={clientAvarage.map(i => i.cliente)}
          data={clientAvarage.map(i => unit === 'sacks' ? i.precoMedioSaca : i.precoMedioKg)}
          unit={unit}
        />
      </div>
    </Container>
  );
}
