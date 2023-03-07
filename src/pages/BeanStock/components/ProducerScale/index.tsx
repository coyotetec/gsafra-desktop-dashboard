import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import { DownloadSimple } from 'phosphor-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../../../components/App';
import { NotAllowed } from '../../../../components/NotAllowed';
import { Spinner } from '../../../../components/Spinner';
import { Switch } from '../../../../components/Switch';
import EstoqueGraosService from '../../../../services/EstoqueGraosService';
import { EstoqueGraosProdutorTotal } from '../../../../types/EstoqueGraos';
import { toast } from '../../../../utils/toast';
import { ProducerScaleChart } from '../ProducerScaleChart';
import { ProducerScaleDetails } from '../ProducerScaleDetails';
import { Container, Loader } from './styles';

interface RangeDates {
  startDate: Date | null;
  endDate: Date | null;
}

interface ProducerScaleProps {
  cropId: string;
  rangeDates: RangeDates;
  producerId: string;
  storageId: string;
  safraId: string;
}

export function ProducerScale({ cropId, rangeDates, producerId, storageId, safraId }: ProducerScaleProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [unit, setUnit] = useState<'kg' | 'sacks'>('kg');
  const chartRef = useRef(null);
  const [requestId, setRequestId] = useState(1);
  const [beanStockProducer, setBeanStockProducer] = useState<EstoqueGraosProdutorTotal>({
    estoqueGraosProdutor: [],
    saldoFinal: []
  });

  const { hasPermission } = useContext(UserContext);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      if (hasPermission('estoque_graos_produtor')) {
        if (cropId === '_') {
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

        const produtorIdParsed = producerId !== '_' ? Number(producerId) : undefined;
        const armazenamentoIdParsed = storageId !== '_' ? Number(storageId) : undefined;
        const safraIdParsed = safraId !== '_' ? Number(safraId) : undefined;
        const startDateParsed = rangeDates.startDate ? format(rangeDates.startDate, 'dd-MM-yyyy') : '';
        const endDateParsed = rangeDates.endDate ? format(rangeDates.endDate, 'dd-MM-yyyy') : '';

        const beanStockProducerData = await EstoqueGraosService.findProducerTotal({
          culturaId: Number(cropId),
          startDate: startDateParsed,
          endDate: endDateParsed,
          produtorId: produtorIdParsed,
          armazenamentoId: armazenamentoIdParsed,
          safraId: safraIdParsed
        });

        setBeanStockProducer(beanStockProducerData);
        setRequestId((prevState) => prevState + 1);
      }
      setIsLoading(false);
    }

    loadData();
  }, [cropId, producerId, rangeDates, safraId, storageId, hasPermission]);

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
      a.download = 'SALDO DOS PRODUTORES';
      a.click();
    });
  }

  return (
    <Container>
      <header>
        <h3>ESTOQUE POR PRODUTOR</h3>
      </header>
      <div className="card" ref={chartRef}>
        {!hasPermission('estoque_graos_produtor') && <NotAllowed />}
        {isLoading && (
          <Loader>
            <Spinner size={48} />
          </Loader>
        )}
        <header data-html2canvas-ignore>
          <Switch
            leftLabel="Kg"
            rightLabel="Sacas"
            isToggled={unit === 'sacks'}
            onToggle={(e) => { setUnit(e.target.checked ? 'sacks' : 'kg'); }}
          />
          <button onClick={handleSaveChart}>
            <DownloadSimple size={24} color="#F7FBFE" weight='regular' />
          </button>
        </header>
        <ProducerScaleChart
          requestId={requestId}
          labels={beanStockProducer.saldoFinal.map((item) => item.produtor)}
          data={beanStockProducer.saldoFinal.map((item) => unit === 'kg' ? item.saldo : item.saldoSacas)}
          unit={unit}
        />
      </div>
      {beanStockProducer.estoqueGraosProdutor.length > 0 && (
        <ProducerScaleDetails
          producersBeansStock={beanStockProducer.estoqueGraosProdutor}
        />
      )}
    </Container>
  );
}
