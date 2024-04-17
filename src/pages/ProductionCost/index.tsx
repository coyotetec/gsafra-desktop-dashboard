import { Info, MagnifyingGlass } from 'phosphor-react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DateInput } from '../../components/DateInput';
import { Header } from '../../components/Header';
import { MultiSelect } from '../../components/MultiSelect';
import { Select } from '../../components/Select';
import useAnimatedUnmount from '../../hooks/useAnimatedUnmount';
import {
  change,
  setFirstSafra,
} from '../../redux/features/productionCostFiltersSlice';
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
import { toast } from '../../utils/toast';
import { compareSelectedSafras } from './utils/compareSelectedSafras';

type optionType = {
  value: string;
  label: string;
}[];

type groupedOptionsType = {
  label: string;
  items: {
    label: string;
    value: string;
  }[];
}[];

const componentsRefInitialState = {
  loadData: () => null,
};

export function ProductionCost() {
  const unitOptions: optionType = [
    { value: 'cost', label: 'Custo (R$)' },
    { value: 'hectareCost', label: 'Custo por Hectare (R$/ha)' },
    { value: 'percent', label: 'Porcentagem (%)' },
  ];
  const categoryCostRef = useRef<componentsRefType>(componentsRefInitialState);
  const talhaoCostRef = useRef<componentsRefType>(componentsRefInitialState);
  const activityCostRef = useRef<componentsRefType>(componentsRefInitialState);
  const maintenanceCostRef = useRef<componentsRefType>(
    componentsRefInitialState,
  );
  const fuelingCostRef = useRef<componentsRefType>(componentsRefInitialState);

  const {
    safrasList,
    productionCostFilters: {
      unit,
      rangeDates,
      safras,
      selectedSafrasOptions,
      talhoesOptions,
      talhao,
      talhoesFetched,
    },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const loadData = useCallback(() => {
    categoryCostRef.current.loadData();
    talhaoCostRef.current.loadData();
    activityCostRef.current.loadData();
    maintenanceCostRef.current.loadData();
    fuelingCostRef.current.loadData();
  }, []);

  const hectareCostMessageVisible = useMemo(
    () => unit === 'hectareCost' && selectedSafrasOptions.length > 1,
    [selectedSafrasOptions, unit],
  );

  const { shouldRender, animatedElementRef } = useAnimatedUnmount(
    hectareCostMessageVisible,
  );

  const loadTalhoes = useCallback(
    async (value: string[]) => {
      if (value.length === 0) {
        toast({
          type: 'danger',
          text: 'Selecione pelo menos uma safra!',
        });
        return;
      }

      if (compareSelectedSafras(value, selectedSafrasOptions)) {
        return;
      }

      const safrasOptions: optionType = [];

      value.forEach((i) => {
        const safra = safrasList.options.find((option) => option.value === i);

        if (safra) {
          safrasOptions.push(safra);
        }
      });

      dispatch(change({ name: 'talhao', value: null }));
      dispatch(
        change({
          name: 'selectedSafrasOptions',
          value: safrasOptions,
        }),
      );

      const talhoesData = await TalhaoService.findTalhoes(value);

      const groupedTalhoes = talhoesData.reduce((acc, curr) => {
        const safraIndex = acc.findIndex((i) => i.label === curr.safra);

        if (safraIndex === -1) {
          acc.push({
            label: curr.safra,
            items: [
              {
                value: String(curr.id),
                label: `${curr.talhao} (${curr.variedade})`,
              },
            ],
          });
        } else {
          acc[safraIndex].items.push({
            value: String(curr.id),
            label: `${curr.talhao} (${curr.variedade})`,
          });
        }

        return acc;
      }, [] as groupedOptionsType);

      dispatch(change({ name: 'talhoesOptions', value: groupedTalhoes }));
    },
    [dispatch, safrasList.options, selectedSafrasOptions],
  );

  useEffect(() => {
    if (!talhoesFetched && safras.length > 0) {
      loadTalhoes(safras);
      dispatch(change({ name: 'talhoesFetched', value: true }));
    }
  }, [dispatch, loadTalhoes, safras, talhoesFetched]);

  useEffect(() => {
    async function loadSafras() {
      if (hasToFetch(safrasList.lastFetch)) {
        const safrasData = await SafraService.findSafras();

        dispatch(
          setSafrasData(
            safrasData.map((item) => ({
              value: String(item.id),
              label: item.nome,
            })),
          ),
        );
      }

      dispatch(setFirstSafra(safrasList.options[0]));
    }

    loadSafras();
  }, [dispatch, safrasList.lastFetch, safrasList.options]);

  return (
    <Container>
      <Header title="Custo da Produção" />
      <div className="filters">
        <MultiSelect
          options={safrasList.options}
          onChange={(value: string[]) => {
            dispatch(change({ name: 'safras', value }));
          }}
          value={safras}
          placeholder="Safras"
          selectedItemsLabel="{0} Safras"
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
            dispatch(change({ name: 'talhao', value }));
          }}
          label="Talhão"
          width="100%"
          isGrouped
        />
        <Select
          options={unitOptions}
          placeholder="Unidade"
          noOptionsMessage="0 unidades encontradas"
          value={unit}
          onChange={(value: string) => {
            dispatch(change({ name: 'unit', value }));
          }}
          label="Unidade"
          width="100%"
        />
        <div className="date-filter">
          <DateInput
            onChangeDate={(date) => {
              if (date && rangeDates.endDate && date > rangeDates.endDate) {
                toast({
                  type: 'danger',
                  text: 'Data final precisa ser maior que inicial!',
                });
                return;
              }
              dispatch(
                change({
                  name: 'rangeDates',
                  value: {
                    startDate: date,
                    endDate: rangeDates.endDate,
                  },
                }),
              );
            }}
            placeholder="Data Inicial"
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
              if (date && rangeDates.startDate && date < rangeDates.startDate) {
                toast({
                  type: 'danger',
                  text: 'Data final precisa ser maior que inicial!',
                });
                return;
              }
              dispatch(
                change({
                  name: 'rangeDates',
                  value: {
                    startDate: rangeDates.startDate,
                    endDate: date,
                  },
                }),
              );
            }}
            placeholder="Data Final"
            defaultDate={rangeDates.endDate}
            height="48px"
            width="100%"
            fontSize="16px"
            horizontalPadding="12px"
            label="Data Final"
          />
        </div>
        <button type="button" onClick={loadData}>
          <MagnifyingGlass size={20} color="#CFD4D6" weight="bold" />
          Pesquisar
        </button>
      </div>
      {shouldRender && (
        <HectareCostMessage
          ref={animatedElementRef}
          isLeaving={!hectareCostMessageVisible}
        >
          <div>
            <Info size={20} color="#F7FBFE" weight="fill" />
          </div>
          <span>
            O custo médio por hectare é feito usando a soma das áreas de todos
            os talhões de todas as safras selecionadas.
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
