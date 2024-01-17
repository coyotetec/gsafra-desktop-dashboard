import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Spinner } from '../../../../components/Spinner';
import { Container, Loader } from './styles';
import { Switch } from '../../../../components/Switch';
import VendaService from '../../../../services/VendaService';
import { format } from 'date-fns';
import { toast } from '../../../../utils/toast';
import { ClientAvarageChart } from '../ClientAvarageChart';
import { DownloadSimple } from 'phosphor-react';
import html2canvas from 'html2canvas';
import { NotAllowed } from '../../../../components/NotAllowed';
import { useUserContext } from '../../../../contexts/UserContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { change } from '../../../../redux/features/salesFiltersSlice';
import { setClientAvarage } from '../../../../redux/features/salesDataSlice';
import { hasToFetch } from '../../../../utils/hasToFetch';
import { componentsRefType } from '../../../../types/Types';

interface ClientAvarageProps {
  safraName: string;
}

export const ClientAvarage = forwardRef<componentsRefType, ClientAvarageProps>(
  ({ safraName }, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const chartRef = useRef(null);
    const isFirstRender = useRef(true);

    const {
      salesFilters: {
        rangeDates,
        safra,
        deliveryStatus,
        clientAvarageUnit: unit,
      },
      salesData: { clientAvarage, clientAvarageLastFetch },
    } = useSelector((state: RootState) => state);
    const dispatch = useDispatch();

    const { hasPermission } = useUserContext();

    const loadData = useCallback(async () => {
      if (hasPermission('vendas_preco_medio_por_cliente')) {
        setIsLoading(true);

        if (isFirstRender.current) {
          isFirstRender.current = false;

          if (!hasToFetch(clientAvarageLastFetch)) {
            setIsLoading(false);
            return;
          }
        }

        if (safra === '_') {
          setIsLoading(false);
          return;
        }

        if (
          rangeDates.endDate &&
          rangeDates.startDate &&
          rangeDates.endDate < rangeDates.startDate
        ) {
          setIsLoading(false);
          toast({
            type: 'danger',
            text: 'Data final precisa ser maior que inicial!',
          });
          return;
        }

        const deliveryStatusParsed =
          deliveryStatus !== '_' ? deliveryStatus : '';
        const startDateParsed = rangeDates.startDate
          ? format(rangeDates.startDate, 'dd-MM-yyyy')
          : '';
        const endDateParsed = rangeDates.endDate
          ? format(rangeDates.endDate, 'dd-MM-yyyy')
          : '';

        const clientAvarageData = await VendaService.findMediaCliente({
          safraId: Number(safra),
          deliveryStatus: deliveryStatusParsed,
          startDate: startDateParsed,
          endDate: endDateParsed,
        });

        dispatch(setClientAvarage(clientAvarageData));
      }
      setIsLoading(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      deliveryStatus,
      dispatch,
      hasPermission,
      rangeDates.endDate,
      rangeDates.startDate,
      safra,
    ]);

    useEffect(() => {
      loadData();
    }, [loadData]);

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
              onToggle={(e) =>
                dispatch(
                  change({
                    name: 'clientAvarageUnit',
                    value: e.target.checked ? 'kg' : 'sacks',
                  }),
                )
              }
            />
            <button onClick={handleSaveChart}>
              <DownloadSimple size={24} color="#F7FBFE" weight="regular" />
            </button>
          </header>
          <ClientAvarageChart
            labels={clientAvarage.map((i) => i.cliente)}
            data={clientAvarage.map((i) =>
              unit === 'sacks' ? i.precoMedioSaca : i.precoMedioKg,
            )}
            unit={unit}
          />
        </div>
      </Container>
    );
  },
);

ClientAvarage.displayName = 'ClientAvarage';
