import { Info } from 'phosphor-react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DateInput } from '../../components/DateInput';
import { Header } from '../../components/Header';
import { MultiSelect } from '../../components/MultiSelect';
import { Select } from '../../components/Select';
import useAnimatedUnmount from '../../hooks/useAnimatedUnmount';
import { change, setFirstSafra } from '../../redux/features/productionCostFiltersSlice';
import { setSafrasData } from '../../redux/features/safrasListSlice';
import { RootState } from '../../redux/store';
import SafraService from '../../services/SafraService';
import TalhaoService from '../../services/TalhaoService';
import { componentsRefType } from '../../types/Types';
import { hasToFetch } from '../../utils/hasToFetch';
import { Activity } from './Components/Activity';
import { CategoryCost } from './Components/CategoryCost';
import { Fueling } from './Components/Fueling';
import { Maintenance } from './Components/Maintenance';
import { TalhaoCost } from './Components/TalhaoCost';
import { Container, HectareCostMessage } from './styles';

type optionType = {
  value: string;
  label: string;
}[];

type groupedOptionsType = {
  label: string;
  items: {
    label: string;
    value: string;
  }[]
}[];

export function ProductionCost() {
  const unitOptions: optionType = [
    { value: 'cost', label: 'Custo (R$)' },
    { value: 'hectareCost', label: 'Custo por Hectare (R$/ha)' },
    { value: 'percent', label: 'Porcentagem (%)' },
  ];
  const categoryCostRef = useRef<componentsRefType>({
    loadData() { return; },
  });
  const talhaoCostRef = useRef<componentsRefType>({
    loadData() { return; },
  });
  const activityCostRef = useRef<componentsRefType>({
    loadData() { return; },
  });
  const maintenanceCostRef = useRef<componentsRefType>({
    loadData() { return; },
  });
  const fuelingCostRef = useRef<componentsRefType>({
    loadData() { return; },
  });

  const {
    safrasList,
    productionCostFilters: {
      unit,
      rangeDates,
      safras,
      talhoesOptions,
      talhao,
      lastSelectedSafras,
    }
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const refreshData = useCallback(() => {
    categoryCostRef.current.loadData();
    talhaoCostRef.current.loadData();
    activityCostRef.current.loadData();
    maintenanceCostRef.current.loadData();
    fuelingCostRef.current.loadData();
  }, []);

  const hectareCostMessageVisible = useMemo(() => (
    unit === 'hectareCost' && lastSelectedSafras.length > 1
  ), [lastSelectedSafras, unit]);

  const {
    shouldRender,
    animatedElementRef
  } = useAnimatedUnmount(hectareCostMessageVisible);

  const loadTalhoes = useCallback(async (value: string[]) => {
    dispatch(change({ name: 'talhao', value: null }));

    if (JSON.stringify(lastSelectedSafras) === JSON.stringify(value)) {
      return;
    }

    const parsedSafras = value.join(',');

    dispatch(change({ name: 'lastSelectedSafras', value }));
    dispatch(change({
      name: 'selectedSafrasOptions',
      value: value.map((i) => {
        const safra = safrasList.options.find((option) => option.value === i) as {
          value: string;
          label: string;
        };

        return safra;
      })
    }));

    const talhoesData = await TalhaoService.findTalhoes(parsedSafras);

    const groupedTalhoes = talhoesData.reduce((acc, curr) => {
      const safraIndex = acc.findIndex((i) => i.label === curr.safra);

      if (safraIndex === -1) {
        acc.push({
          label: curr.safra,
          items: [{
            value: String(curr.id),
            label: `${curr.talhao} (${curr.variedade})`
          }]
        });
      } else {
        acc[safraIndex].items.push({
          value: String(curr.id),
          label: `${curr.talhao} (${curr.variedade})`
        });
      }

      return acc;
    }, [] as groupedOptionsType);

    dispatch(change({ name: 'talhoesOptions', value: groupedTalhoes }));
  }, [dispatch, lastSelectedSafras, safrasList.options]);

  useEffect(() => {
    async function loadSafras() {
      if (hasToFetch(safrasList.lastFetch)) {
        const safrasData = await SafraService.findSafras();
        dispatch(setSafrasData(safrasData.map((item) => ({
          value: String(item.id),
          label: item.nome
        }))));
      }

      dispatch(setFirstSafra(safrasList.options[0]?.value || null));
      if (safrasList.options[0]?.value && talhoesOptions.length === 0) {
        loadTalhoes([safrasList.options[0].value]);
      }
    }

    loadSafras();
  }, [dispatch, safrasList.lastFetch, safrasList.options, loadTalhoes, talhoesOptions]);

  return (
    <Container>
      <Header
        title="Custo da Produção"
        refreshData={refreshData}
      />
      <div className="filters">
        <MultiSelect
          options={safrasList.options}
          onChange={(value: string[]) => {
            dispatch(change({ name: 'safras', value: value }));
          }}
          value={safras}
          placeholder="Safras"
          selectedItemsLabel='{0} Safras'
          onClose={loadTalhoes}
          label="Safras"
          width="100%"
        />
        <Select
          options={talhoesOptions}
          placeholder="Talhão"
          noOptionsMessage="0 talhões encontrada"
          value={talhao}
          onChange={(value: string | null) => {
            dispatch(change({ name: 'talhao', value: value }));
          }}
          label="Talhão"
          width="100%"
          isGrouped
        />
        <div className="date-filter">
          <DateInput
            onChangeDate={(date) => {
              dispatch(change({
                name: 'rangeDates', value: {
                  startDate: date,
                  endDate: rangeDates.endDate
                }
              }));
            }}
            placeholder='Data Inicial'
            defaultDate={rangeDates.startDate}
            height="48px"
            width="100%"
            fontSize="16px"
            horizontalPadding="12px"
            label="Data Inicial"
          />
          <strong>à</strong>
          <DateInput
            onChangeDate={(date) => {
              dispatch(change({
                name: 'rangeDates', value: {
                  startDate: rangeDates.startDate,
                  endDate: date
                }
              }));
            }}
            placeholder='Data Final'
            defaultDate={rangeDates.endDate}
            height="48px"
            width="100%"
            fontSize="16px"
            horizontalPadding="12px"
            label="Data Final"
          />
        </div>
        <Select
          options={unitOptions}
          placeholder="Unidade"
          noOptionsMessage="0 unidades encontradas"
          value={unit}
          onChange={(value: string) => {
            dispatch(change({ name: 'unit', value: value }));
          }}
          label="Unidade"
          width="100%"
        />
      </div>
      {shouldRender && (
        <HectareCostMessage
          ref={animatedElementRef}
          isLeaving={!hectareCostMessageVisible}
        >
          <div>
            <Info size={20} color="#F7FBFE" weight='fill' />
          </div>
          <span>
            O custo médio por hectare é feito usando a soma das áreas de todos os talhões de todas as safras selecionadas.
          </span>
        </HectareCostMessage>
      )}
      <CategoryCost ref={categoryCostRef} />
      <TalhaoCost ref={talhaoCostRef} />
      <Activity ref={activityCostRef} />
      <Maintenance ref={maintenanceCostRef} />
      <Fueling ref={fuelingCostRef} />
    </Container>
  );
}
