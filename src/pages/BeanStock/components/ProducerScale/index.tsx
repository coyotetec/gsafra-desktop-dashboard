import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import { DownloadSimple } from 'phosphor-react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
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
import { hasToFetch } from '../../../../utils/hasToFetch';
import { toast } from '../../../../utils/toast';
import { ProducerScaleChart } from '../ProducerScaleChart';
import { ProducerScaleDetails } from '../ProducerScaleDetails';
import { Container, Loader } from './styles';

export const ProducerScale = forwardRef<componentsRefType>((props, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const [requestId, setRequestId] = useState(1);
  const chartRef = useRef(null);
  const isFirstRender = useRef(true);

  const {
    beanStockFilters: {
      crop,
      rangeDates,
      producer,
      storage,
      safra,
      producerStockUnit: unit,
    },
    beanStockData: {
      beanStockProducer,
      beanStockProducerLastFetch,
    }
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const { hasPermission } = useUserContext();

  const loadData = useCallback(async () => {
    if (hasPermission('estoque_graos_produtor')) {
      setIsLoading(true);

      if (isFirstRender.current) {
        isFirstRender.current = false;

        if (!hasToFetch(beanStockProducerLastFetch)) {
          setIsLoading(false);
          return;
        }
      }

      if (crop === '_') {
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

      const produtorIdParsed = producer !== '_' ? Number(producer) : undefined;
      const armazenamentoIdParsed = storage !== '_' ? Number(storage) : undefined;
      const safraIdParsed = safra !== '_' ? Number(safra) : undefined;
      const startDateParsed = rangeDates.startDate ? format(rangeDates.startDate, 'dd-MM-yyyy') : '';
      const endDateParsed = rangeDates.endDate ? format(rangeDates.endDate, 'dd-MM-yyyy') : '';

      const beanStockProducerData = await EstoqueGraosService.findProducerTotal({
        culturaId: Number(crop),
        startDate: startDateParsed,
        endDate: endDateParsed,
        produtorId: produtorIdParsed,
        armazenamentoId: armazenamentoIdParsed,
        safraId: safraIdParsed
      });

      dispatch(setBeanStockProducer(beanStockProducerData));

      setRequestId((prevState) => prevState + 1);
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crop, dispatch, hasPermission, producer, rangeDates.endDate, rangeDates.startDate, safra, storage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useImperativeHandle(ref, () => ({
    loadData
  }), [loadData]);

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
            onToggle={(e) => dispatch(change({
              name: 'producerStockUnit',
              value: e.target.checked ? 'sacks' : 'kg'
            }))}
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
        <ProducerScaleDetails />
      )}
    </Container>
  );
});
