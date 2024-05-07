import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import { DownloadSimple } from 'phosphor-react';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NotAllowed } from '../../../../components/NotAllowed';
import { Spinner } from '../../../../components/Spinner';
import { Switch } from '../../../../components/Switch';
import { useUserContext } from '../../../../contexts/UserContext';
import { setBeanStockProducer } from '../../../../redux/features/beanStockDataSlice';
import { change } from '../../../../redux/features/beanStockFiltersSlice';
import { RootState } from '../../../../redux/store';
import EstoqueGraosService from '../../../../services/EstoqueGraosService';
import { componentsRefType } from '../../../../types/Types';
import { ProducerScaleChart } from '../ProducerScaleChart';
import { ProducerScaleDetails } from '../ProducerScaleDetails';
import { Container, Loader } from './styles';

export const ProducerScale = forwardRef<componentsRefType>((props, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const [requestId, setRequestId] = useState(1);
  const chartRef = useRef(null);

  const {
    beanStockFilters: {
      crop,
      rangeDates,
      producer,
      storage,
      safra,
      producerStockUnit: unit,
    },
    beanStockData: { beanStockProducer },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const { hasPermission } = useUserContext();

  const loadData = useCallback(async () => {
    if (hasPermission('estoque_graos_produtor')) {
      setIsLoading(true);

      if (crop === '_') {
        console.log(3);
        setIsLoading(false);
        return;
      }

      const produtorIdParsed = producer !== '_' ? Number(producer) : undefined;
      const armazenamentoIdParsed =
        storage !== '_' ? Number(storage) : undefined;
      const safraIdParsed = safra !== '_' ? Number(safra) : undefined;
      const startDateParsed = rangeDates.startDate
        ? format(rangeDates.startDate, 'dd-MM-yyyy')
        : '';
      const endDateParsed = rangeDates.endDate
        ? format(rangeDates.endDate, 'dd-MM-yyyy')
        : '';

      const beanStockProducerData = await EstoqueGraosService.findProducerTotal(
        {
          culturaId: Number(crop),
          startDate: startDateParsed,
          endDate: endDateParsed,
          produtorId: produtorIdParsed,
          armazenamentoId: armazenamentoIdParsed,
          safraId: safraIdParsed,
        },
      );

      dispatch(setBeanStockProducer(beanStockProducerData));

      setRequestId((prevState) => prevState + 1);
    }
    setIsLoading(false);
  }, [
    crop,
    dispatch,
    hasPermission,
    producer,
    rangeDates.endDate,
    rangeDates.startDate,
    safra,
    storage,
  ]);

  useImperativeHandle(
    ref,
    () => ({
      loadData,
    }),
    [loadData],
  );

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
            onToggle={(e) =>
              dispatch(
                change({
                  name: 'producerStockUnit',
                  value: e.target.checked ? 'sacks' : 'kg',
                }),
              )
            }
          />
          <button onClick={handleSaveChart}>
            <DownloadSimple size={24} color="#F7FBFE" weight="regular" />
          </button>
        </header>
        <ProducerScaleChart
          requestId={requestId}
          labels={beanStockProducer.saldoFinal.map((item) => item.produtor)}
          data={beanStockProducer.saldoFinal.map((item) =>
            unit === 'kg' ? item.saldo : item.saldoSacas,
          )}
          unit={unit}
        />
      </div>
      {beanStockProducer.estoqueGraosProdutor.length > 0 && (
        <ProducerScaleDetails />
      )}
    </Container>
  );
});

ProducerScale.displayName = 'ProducerScale';
