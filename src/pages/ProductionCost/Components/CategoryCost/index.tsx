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
import CustoProducaoService from '../../../../services/CustoProducaoService';
import { toast } from '../../../../utils/toast';
import { format } from 'date-fns';
import { currencyFormat } from '../../../../utils/currencyFormat';
import { CategoryCostChart } from '../CategoryCostChart';
import { NotAllowed } from '../../../../components/NotAllowed';
import html2canvas from 'html2canvas';
import { DownloadSimple } from 'phosphor-react';
import { useUserContext } from '../../../../contexts/UserContext';
import { RootState } from '../../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { hasToFetch } from '../../../../utils/hasToFetch';
import { setData } from '../../../../redux/features/productionCostDataSlice';
import { componentsRefType } from '../../../../types/Types';

export const CategoryCost = forwardRef<componentsRefType>((props, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);
  const isFirstRender = useRef(true);

  const {
    productionCostFilters: { unit, rangeDates, selectedSafrasOptions, talhao },
    productionCostData: { categoryCost },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const { hasPermission } = useUserContext();

  const loadData = useCallback(async () => {
    if (hasPermission('custo_producao_categoria')) {
      setIsLoading(true);

      if (isFirstRender.current) {
        isFirstRender.current = false;

        if (!hasToFetch(categoryCost.lastFetch)) {
          setIsLoading(false);
          return;
        }
      }

      if (selectedSafrasOptions.length === 0) {
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

      const startDateParsed = rangeDates.startDate
        ? format(rangeDates.startDate, 'dd-MM-yyyy')
        : '';
      const endDateParsed = rangeDates.endDate
        ? format(rangeDates.endDate, 'dd-MM-yyyy')
        : '';

      const categoryCostData = await CustoProducaoService.findCustoCategoria({
        safraId: selectedSafrasOptions.map(({ value }) => value).join(','),
        talhaoId: talhao ? Number(talhao) : undefined,
        startDate: startDateParsed,
        endDate: endDateParsed,
      });

      dispatch(
        setData({
          name: 'categoryCost',
          data: categoryCostData,
        }),
      );
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    hasPermission,
    rangeDates.endDate,
    rangeDates.startDate,
    selectedSafrasOptions,
    talhao,
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
      a.download = 'CUSTO PRODUÇÃO';
      a.click();
    });
  }

  return (
    <Container>
      <header>
        <h3>CUSTOS POR CATEGORIA</h3>
      </header>
      <div className="card" ref={chartRef}>
        {!hasPermission('custo_producao_categoria') && <NotAllowed />}
        {isLoading && (
          <Loader>
            <Spinner size={48} />
          </Loader>
        )}
        <header>
          <div className="total">
            <span>
              <strong>
                {unit === 'hectareCost' ? 'Custo Total/ha: ' : 'Custo Total: '}
              </strong>
              {unit === 'hectareCost' &&
                currencyFormat(categoryCost.totalCustoPorHectare)}
              {unit === 'cost' && currencyFormat(categoryCost.totalCusto)}
              {unit === 'percent' && currencyFormat(categoryCost.totalCusto)}
            </span>
          </div>
          <button onClick={handleSaveChart} data-html2canvas-ignore>
            <DownloadSimple size={24} color="#F7FBFE" weight="regular" />
          </button>
        </header>
        <CategoryCostChart
          labels={categoryCost.totalCustoCategoria.map((i) => i.categoria)}
          data={categoryCost.totalCustoCategoria.map((i) =>
            unit === 'hectareCost' ? i.totalPorHectare : i.total,
          )}
          percentages={categoryCost.totalCustoCategoria.map(
            (i) => i.porcentagem,
          )}
          unit={unit}
        />
      </div>
    </Container>
  );
});

CategoryCost.displayName = 'CategoryCost';
