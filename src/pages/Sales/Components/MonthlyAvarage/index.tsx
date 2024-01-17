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
import { MonthlyAvarageChart } from '../MonthlyAvarageChart';
import { DownloadSimple } from 'phosphor-react';
import html2canvas from 'html2canvas';
import { currencyFormat } from '../../../../utils/currencyFormat';
import { NotAllowed } from '../../../../components/NotAllowed';
import { useUserContext } from '../../../../contexts/UserContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { change } from '../../../../redux/features/salesFiltersSlice';
import { setMonthlyAvarage } from '../../../../redux/features/salesDataSlice';
import { hasToFetch } from '../../../../utils/hasToFetch';
import { componentsRefType } from '../../../../types/Types';

interface MonthlyAvarageProps {
  safraName: string;
}

export const MonthlyAvarage = forwardRef<
  componentsRefType,
  MonthlyAvarageProps
>(({ safraName }, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);
  const isFirstRender = useRef(true);

  const {
    salesFilters: {
      rangeDates,
      safra,
      deliveryStatus,
      monthlyAvarageUnit: unit,
    },
    salesData: { monthlyAvarage, monthlyAvarageLastFetch },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const { hasPermission } = useUserContext();

  const loadData = useCallback(async () => {
    if (hasPermission('vendas_preco_medio_por_mes')) {
      setIsLoading(true);

      if (isFirstRender.current) {
        isFirstRender.current = false;

        if (!hasToFetch(monthlyAvarageLastFetch)) {
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

      const deliveryStatusParsed = deliveryStatus !== '_' ? deliveryStatus : '';
      const startDateParsed = rangeDates.startDate
        ? format(rangeDates.startDate, 'dd-MM-yyyy')
        : '';
      const endDateParsed = rangeDates.endDate
        ? format(rangeDates.endDate, 'dd-MM-yyyy')
        : '';

      const monthlyAvarageData = await VendaService.findMediaMes({
        safraId: Number(safra),
        deliveryStatus: deliveryStatusParsed,
        startDate: startDateParsed,
        endDate: endDateParsed,
      });

      dispatch(setMonthlyAvarage(monthlyAvarageData));
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
          <div className="left-side">
            <Switch
              leftLabel="Saca"
              rightLabel="Kg"
              isToggled={unit === 'kg'}
              onToggle={(e) =>
                dispatch(
                  change({
                    name: 'monthlyAvarageUnit',
                    value: e.target.checked ? 'kg' : 'sacks',
                  }),
                )
              }
            />
            <button onClick={handleSaveChart}>
              <DownloadSimple size={24} color="#F7FBFE" weight="regular" />
            </button>
          </div>
        </header>
        <MonthlyAvarageChart
          labels={monthlyAvarage.mediaMes.map((i) => i.mes)}
          data={monthlyAvarage.mediaMes.map((i) =>
            unit === 'sacks' ? i.precoMedioSaca : i.precoMedioKg,
          )}
          unit={unit}
        />
      </div>
    </Container>
  );
});

MonthlyAvarage.displayName = 'MonthlyAvarage';
