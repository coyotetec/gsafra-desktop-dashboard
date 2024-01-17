import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { format } from 'date-fns';
import { Container, Loader } from './styles';

import { TalhaoCostChart } from '../TalhaoCostChart';
import { Spinner } from '../../../../components/Spinner';

import CustoProducaoService from '../../../../services/CustoProducaoService';

import { toast } from '../../../../utils/toast';
import { currencyFormat } from '../../../../utils/currencyFormat';
import { Select } from '../../../../components/Select';
import { NotAllowed } from '../../../../components/NotAllowed';
import { DownloadSimple } from 'phosphor-react';
import html2canvas from 'html2canvas';
import { useUserContext } from '../../../../contexts/UserContext';
import { RootState } from '../../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { change } from '../../../../redux/features/productionCostFiltersSlice';
import { hasToFetch } from '../../../../utils/hasToFetch';
import { setData } from '../../../../redux/features/productionCostDataSlice';
import { componentsRefType } from '../../../../types/Types';

export const TalhaoCost = forwardRef<componentsRefType>((props, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);
  const isFirstRender = useRef(true);
  const isDataFirstRender = useRef(true);

  const {
    productionCostFilters: {
      unit,
      rangeDates,
      lastSelectedSafras: safras,
      selectedSafrasOptions,
      talhaoSelectedSafra: selectedSafra,
    },
    productionCostData: { talhaoCost },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const { hasPermission } = useUserContext();

  const loadData = useCallback(async () => {
    if (hasPermission('custo_producao_talhao')) {
      setIsLoading(true);

      if (isDataFirstRender.current) {
        isDataFirstRender.current = false;

        if (!hasToFetch(talhaoCost.lastFetch)) {
          setIsLoading(false);
          return;
        }
      }

      if (safras.length === 0) {
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

      const talhaoCostData = await CustoProducaoService.findCustoTalhao({
        safraId: selectedSafra === '_' ? safras.join(',') : selectedSafra,
        startDate: startDateParsed,
        endDate: endDateParsed,
      });

      dispatch(
        setData({
          name: 'talhaoCost',
          data: talhaoCostData,
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
    safras,
    selectedSafra,
  ]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    dispatch(change({ name: 'talhaoSelectedSafra', value: '_' }));
  }, [safras, dispatch]);

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
        <h3>CUSTOS POR TALHÃO (VARIEDADE)</h3>
        {selectedSafrasOptions.length >= 2 && (
          <Select
            options={[
              {
                value: '_',
                label: 'Todas as Safras Selecionadas',
              },
              ...selectedSafrasOptions,
            ]}
            value={selectedSafra}
            onChange={(value: string) => {
              dispatch(change({ name: 'talhaoSelectedSafra', value }));
            }}
            height="40px"
            width="324px"
            placeholder="Selecione uma safra"
          />
        )}
      </header>
      <div className="card" ref={chartRef}>
        {!hasPermission('custo_producao_talhao') && <NotAllowed />}
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
                currencyFormat(talhaoCost.totalCustoPorHectare)}
              {unit === 'cost' && currencyFormat(talhaoCost.totalCusto)}
              {unit === 'percent' && currencyFormat(talhaoCost.totalCusto)}
            </span>
          </div>
          <button onClick={handleSaveChart} data-html2canvas-ignore>
            <DownloadSimple size={24} color="#F7FBFE" weight="regular" />
          </button>
        </header>
        <TalhaoCostChart
          labels={talhaoCost.totalCustoTalhao.map((i) => i.talhaoVariedade)}
          safras={talhaoCost.totalCustoTalhao.map((i) => i.safra)}
          data={talhaoCost.totalCustoTalhao.map((i) =>
            unit === 'cost'
              ? i.total
              : unit === 'hectareCost'
                ? i.totalPorHectare
                : i.porcentagem,
          )}
          unit={unit}
        />
      </div>
    </Container>
  );
});

TalhaoCost.displayName = 'TalhaoCost';
