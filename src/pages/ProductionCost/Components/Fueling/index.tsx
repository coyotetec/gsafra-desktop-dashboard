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

export const Fueling = forwardRef<componentsRefType>((props, ref) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    productionCostFilters: {
      unit: parentUnit,
      rangeDates,
      selectedSafrasOptions,
      talhao,
      fuelingUnit: unit,
    },
    productionCostData: { fuelingCost },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const { hasPermission } = useUserContext();

  const loadData = useCallback(async () => {
    if (hasPermission('custo_producao_insumo_abastecimento')) {
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

      const fuelingCostData = await CustoProducaoService.findCustoAbastecimento(
        {
          safraId: selectedSafrasOptions.map(({ value }) => value).join(','),
          talhaoId: talhao ? Number(talhao) : undefined,
          startDate: startDateParsed,
          endDate: endDateParsed,
        },
      );

      dispatch(
        setData({
          name: 'fuelingCost',
          data: fuelingCostData,
        }),
      );
    }
    setIsLoading(false);
  }, [
    dispatch,
    hasPermission,
    rangeDates.endDate,
    rangeDates.startDate,
    selectedSafrasOptions,
    talhao,
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
        <h3>CUSTOS DE ABASTECIMENTO</h3>
      </header>
      <div className="card">
        {!hasPermission('custo_producao_insumo_abastecimento') && (
          <NotAllowed />
        )}
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
                currencyFormat(fuelingCost?.inputsTotalPorHectareSafra || 0)}
              {parentUnit === 'cost' &&
                currencyFormat(fuelingCost?.inputsTotalSafra || 0)}
              {parentUnit === 'percent' &&
                currencyFormat(fuelingCost?.inputsTotalSafra || 0)}
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
                  name: 'fuelingUnit',
                  value: e.target.checked ? 'qty' : 'parent',
                }),
              )
            }
          />
        </header>
        <ActivityChart
          labels={fuelingCost?.inputsTotal.map((i) => i.insumo) || []}
          units={fuelingCost?.inputsTotal.map((i) => i.unidade) || []}
          data={
            fuelingCost?.inputsTotal.map((i) =>
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

Fueling.displayName = 'Fueling';
