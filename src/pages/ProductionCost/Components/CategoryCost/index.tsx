import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Spinner } from '../../../../components/Spinner';
import { Container, Loader } from './styles';
import CustoProducaoService from '../../../../services/CustoProducaoService';
import { format } from 'date-fns';
import { currencyFormat } from '../../../../utils/currencyFormat';
import { CategoryCostChart } from '../CategoryCostChart';
import { NotAllowed } from '../../../../components/NotAllowed';
import html2canvas from 'html2canvas';
import { DownloadSimple } from 'phosphor-react';
import { useUserContext } from '../../../../contexts/UserContext';
import { RootState } from '../../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from '../../../../redux/features/productionCostDataSlice';
import { componentsRefType } from '../../../../types/Types';

export const CategoryCost = forwardRef<componentsRefType>((props, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const chartRef = useRef(null);

  const {
    productionCostFilters: { unit, rangeDates, selectedSafrasOptions, talhao },
    productionCostData: { categoryCost },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const { hasPermission } = useUserContext();

  const loadData = useCallback(async () => {
    if (hasPermission('custo_producao_categoria')) {
      setIsLoading(true);

      if (selectedSafrasOptions.length === 0) {
        setIsLoading(false);
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
  }, [
    selectedSafrasOptions,
    rangeDates.startDate,
    rangeDates.endDate,
    talhao,
    hasPermission,
    dispatch,
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
                currencyFormat(categoryCost?.totalCustoPorHectare || 0)}
              {unit === 'cost' && currencyFormat(categoryCost?.totalCusto || 0)}
              {unit === 'percent' &&
                currencyFormat(categoryCost?.totalCusto || 0)}
            </span>
          </div>
          <button onClick={handleSaveChart} data-html2canvas-ignore>
            <DownloadSimple size={24} color="#F7FBFE" weight="regular" />
          </button>
        </header>
        <CategoryCostChart
          labels={
            categoryCost?.totalCustoCategoria.map((i) => i.categoria) || []
          }
          data={
            categoryCost?.totalCustoCategoria.map((i) =>
              unit === 'hectareCost' ? i.totalPorHectare : i.total,
            ) || []
          }
          percentages={
            categoryCost?.totalCustoCategoria.map((i) => i.porcentagem) || []
          }
          unit={unit}
        />
      </div>
    </Container>
  );
});

CategoryCost.displayName = 'CategoryCost';
