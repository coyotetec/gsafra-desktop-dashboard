import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { Spinner } from '../../../../components/Spinner';
import { Container, Loader } from './styles';
import { ActivityChart } from '../ActivityChart';
import CustoProducaoService from '../../../../services/CustoProducaoService';
import { format } from 'date-fns';
import { currencyFormat } from '../../../../utils/currencyFormat';
import { Switch } from '../../../../components/Switch';
import { NotAllowed } from '../../../../components/NotAllowed';
import { useUserContext } from '../../../../contexts/UserContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { change } from '../../../../redux/features/productionCostFiltersSlice';
import { setData } from '../../../../redux/features/productionCostDataSlice';
import { componentsRefType } from '../../../../types/Types';

export const Activity = forwardRef<componentsRefType>((props, ref) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    productionCostFilters: {
      unit: parentUnit,
      rangeDates,
      selectedSafrasOptions,
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

      const activityCostData = await CustoProducaoService.findCustoAtividade({
        safraId: selectedSafrasOptions.map(({ value }) => value).join(','),
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
  }, [
    rangeDates.endDate,
    rangeDates.startDate,
    selectedSafrasOptions,
    talhao,
    dispatch,
    hasPermission,
  ]);

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
                currencyFormat(activityCost?.inputsTotalPorHectareSafra || 0)}
              {parentUnit === 'cost' &&
                currencyFormat(activityCost?.inputsTotalSafra || 0)}
              {parentUnit === 'percent' &&
                currencyFormat(activityCost?.inputsTotalSafra || 0)}
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
          labels={activityCost?.inputsTotal.map((i) => i.insumo) || []}
          units={activityCost?.inputsTotal.map((i) => i.unidade) || []}
          data={
            activityCost?.inputsTotal.map((i) =>
              unit === 'qty'
                ? i.quantidade
                : parentUnit === 'cost'
                  ? i.total
                  : parentUnit === 'hectareCost'
                    ? i.totalPorHectare
                    : i.porcentagem,
            ) || []
          }
          unit={unit === 'parent' ? parentUnit : unit}
        />
      </div>
    </Container>
  );
});

Activity.displayName = 'Activity';
