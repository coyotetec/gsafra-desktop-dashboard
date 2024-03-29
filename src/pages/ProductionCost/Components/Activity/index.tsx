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
import { ActivityChart } from '../ActivityChart';
import CustoProducaoService from '../../../../services/CustoProducaoService';
import { format } from 'date-fns';
import { toast } from '../../../../utils/toast';
import { currencyFormat } from '../../../../utils/currencyFormat';
import { Switch } from '../../../../components/Switch';
import { NotAllowed } from '../../../../components/NotAllowed';
import { useUserContext } from '../../../../contexts/UserContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { change } from '../../../../redux/features/productionCostFiltersSlice';
import { hasToFetch } from '../../../../utils/hasToFetch';
import { setData } from '../../../../redux/features/productionCostDataSlice';
import { componentsRefType } from '../../../../types/Types';

export const Activity = forwardRef<componentsRefType>((props, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const isFirstRender = useRef(true);

  const {
    productionCostFilters: {
      unit: parentUnit,
      rangeDates,
      lastSelectedSafras: safras,
      talhao,
      activityUnit: unit,
    },
    productionCostData: { activityCost },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const { hasPermission } = useUserContext();

  const loadData = useCallback(async () => {
    if (hasPermission('custo_producao_insumo_atividade')) {
      setIsLoading(true);

      if (isFirstRender.current) {
        isFirstRender.current = false;

        if (!hasToFetch(activityCost.lastFetch)) {
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

      const activityCostData = await CustoProducaoService.findCustoAtividade({
        safraId: safras.join(','),
        talhaoId: talhao ? Number(talhao) : undefined,
        startDate: startDateParsed,
        endDate: endDateParsed,
      });

      dispatch(
        setData({
          name: 'activityCost',
          data: activityCostData,
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

  return (
    <Container>
      <header>
        <h3>CUSTOS DE ATIVIDADES AGRÍCOLAS</h3>
      </header>
      <div className="card">
        {!hasPermission('custo_producao_insumo_atividade') && <NotAllowed />}
        {isLoading && (
          <Loader>
            <Spinner size={48} />
          </Loader>
        )}
        <header>
          <div className="total">
            <span>
              <strong>
                {parentUnit === 'hectareCost'
                  ? 'Custo Total/ha: '
                  : 'Custo Total: '}
              </strong>
              {parentUnit === 'hectareCost' &&
                currencyFormat(activityCost.inputsTotalPorHectareSafra)}
              {parentUnit === 'cost' &&
                currencyFormat(activityCost.inputsTotalSafra)}
              {parentUnit === 'percent' &&
                currencyFormat(activityCost.inputsTotalSafra)}
            </span>
          </div>
          <Switch
            leftLabel={
              parentUnit === 'cost'
                ? 'R$'
                : parentUnit === 'hectareCost'
                  ? 'R$/ha'
                  : '%'
            }
            rightLabel="Quantidade"
            isToggled={unit === 'qty'}
            onToggle={(e) =>
              dispatch(
                change({
                  name: 'activityUnit',
                  value: e.target.checked ? 'qty' : 'parent',
                }),
              )
            }
          />
        </header>
        <ActivityChart
          labels={activityCost.inputsTotal.map((i) => i.insumo)}
          units={activityCost.inputsTotal.map((i) => i.unidade)}
          data={activityCost.inputsTotal.map((i) =>
            unit === 'qty'
              ? i.quantidade
              : parentUnit === 'cost'
                ? i.total
                : parentUnit === 'hectareCost'
                  ? i.totalPorHectare
                  : i.porcentagem,
          )}
          unit={unit === 'parent' ? parentUnit : unit}
        />
      </div>
    </Container>
  );
});

Activity.displayName = 'Activity';
