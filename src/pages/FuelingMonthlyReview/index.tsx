import { format } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DateInput } from '../../components/DateInput';
import { Header } from '../../components/Header';
import { Loader } from '../../components/Loader';
import { Select } from '../../components/Select';
import { useUserContext } from '../../contexts/UserContext';
import { change } from '../../redux/features/fuelingMonthlyFiltersSlice';
import { setData } from '../../redux/features/fuelingMonthlyDataSlice';
import { setFuelsData } from '../../redux/features/fuelsListSlice';
import { setPatrimoniesData } from '../../redux/features/patrimoniesListSlice';
import { setPatrimonyTypesData } from '../../redux/features/patrimonyTypesListSlice';
import { setStoreroomsData } from '../../redux/features/storeroomsListSlice';
import { RootState } from '../../redux/store';
import AbastecimentoService from '../../services/AbastecimentoService';
import AlmoxarifadoService from '../../services/AlmoxarifadoService';
import PatrimonioService from '../../services/PatrimonioService';
import ProdutoAlmoxarifadoService from '../../services/ProdutoAlmoxarifadoService';
import TipoPatrimonioService from '../../services/TipoPatrimonioService';
import { hasToFetch } from '../../utils/hasToFetch';
import { toast } from '../../utils/toast';
import { MonthlyReview } from './components/MonthlyReview';
import { Container } from './styles';

type optionType = {
  value: string;
  label: string;
}[];

export function FuelingMonthlyReview() {
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const isFirstRender = useRef(true);
  const custos: optionType = [
    { value: 'medio', label: 'Custo Médio' },
    { value: 'atual', label: 'Custo Atual' },
  ];

  const {
    fuelingMonthlyFilters: filters,
    fuelingMonthlyData: fuelingMonthly,
    patrimoniesList,
    fuelsList,
    storeroomsList,
    patrimonyTypesList,
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const { hasPermission } = useUserContext();

  const loadData = useCallback(async () => {
    if (hasPermission('resumo_mensal_abastecimento')) {
      setIsDataLoading(true);

      if (isFirstRender.current) {
        isFirstRender.current = false;

        if (!hasToFetch(fuelingMonthly.lastFetch)) {
          setIsDataLoading(false);
          return;
        }
      }

      if (filters.rangeDates.endDate && filters.rangeDates.startDate && filters.rangeDates.endDate < filters.rangeDates.startDate) {
        setIsDataLoading(false);
        dispatch(setData({
          labels: [],
          values: [],
          valuesTotal: 0,
          quantities: [],
          quantitiesTotal: 0
        }));
        toast({
          type: 'danger',
          text: 'Data final precisa ser maior que inicial!'
        });
        return;
      }

      const monthlyReviewData = await AbastecimentoService.findMonthlyReview({
        custo: filters.cost,
        startDate: filters.rangeDates.startDate ? format(filters.rangeDates.startDate, 'dd-MM-yyyy') : '',
        endDate: filters.rangeDates.endDate ? format(filters.rangeDates.endDate, 'dd-MM-yyyy') : '',
        idPatrimonio: filters.patrimony !== '_' ? filters.patrimony : undefined,
        idProdutoAlmoxarifado: filters.fuel !== '_' ? filters.fuel : undefined,
        idAlmoxarifado: filters.storeroom !== '_' ? filters.storeroom : undefined,
        idTipoPatrimonio: filters.patrimonyType !== '_' ? filters.patrimonyType : undefined,
      });

      dispatch(setData({
        labels: monthlyReviewData.monthlyValue.map(item => item.month),
        values: monthlyReviewData.monthlyValue.map(item => item.value),
        valuesTotal: monthlyReviewData.monthlyValueTotal,
        quantities: monthlyReviewData.monthlyQty.map(item => item.value),
        quantitiesTotal: monthlyReviewData.monthlyQtyTotal
      }));
    }

    setIsDataLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    filters.cost,
    filters.fuel,
    filters.patrimony,
    filters.patrimonyType,
    filters.rangeDates.endDate,
    filters.rangeDates.startDate,
    filters.storeroom,
    hasPermission
  ]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      if (hasToFetch(patrimoniesList.lastFetch)) {
        const patrimoniosData = await PatrimonioService.findPatrimonios();
        dispatch(setPatrimoniesData(patrimoniosData.map((item) => ({
          value: String(item.id),
          label: item.descricao
        }))));
      }

      if (hasToFetch(fuelsList.lastFetch)) {
        const combustiveisData = await ProdutoAlmoxarifadoService.findCombustiveis();
        dispatch(setFuelsData(combustiveisData.map(item => ({
          value: String(item.id),
          label: item.nome
        }))));
      }

      if (hasToFetch(storeroomsList.lastFetch)) {
        const almoxarifadosData = await AlmoxarifadoService.findAlmoxarifados();
        dispatch(setStoreroomsData(almoxarifadosData.map(item => ({
          value: String(item.id),
          label: item.nome
        }))));
      }

      if (hasToFetch(patrimonyTypesList.lastFetch)) {
        const tiposPatrimonioData = await TipoPatrimonioService.findTiposPatrimonio();
        dispatch(setPatrimonyTypesData(tiposPatrimonioData.map(item => ({
          value: String(item.id),
          label: item.nome
        }))));
      }

      setIsLoading(false);
    }

    loadData();
  }, [
    dispatch,
    patrimoniesList.lastFetch,
    fuelsList.lastFetch,
    storeroomsList.lastFetch,
    patrimonyTypesList.lastFetch
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Container>
      <Loader isLoading={isLoading} />
      <Header
        title="Resumo Mensal de Abastecimento"
        refreshData={loadData}
      />
      <div className="filters">
        <div className="date-filter">
          <DateInput
            onChangeDate={(date) => {
              dispatch(change({
                name: 'rangeDates', value: {
                  startDate: date,
                  endDate: filters.rangeDates.endDate
                }
              }));
            }}
            placeholder='Data Inicial'
            defaultDate={filters.rangeDates.startDate}
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
                  startDate: filters.rangeDates.startDate,
                  endDate: date
                }
              }));
            }}
            placeholder='Data Final'
            defaultDate={filters.rangeDates.endDate}
            height="48px"
            width="100%"
            fontSize="16px"
            horizontalPadding="12px"
            label="Data Final"
          />
        </div>

        <Select
          options={[{
            value: '_',
            label: 'Todos',
          }, ...patrimoniesList.options]}
          value={filters.patrimony}
          onChange={(value: string) => {
            dispatch(change({ name: 'patrimony', value: value }));
          }}
          placeholder="Patrimonio"
          label="Patrimonio"
          noOptionsMessage="0 patrimonios encontrados"
          width="100%"
        />
        <Select
          options={[{
            value: '_',
            label: 'Todos',
          }, ...fuelsList.options]}
          value={filters.fuel}
          onChange={(value: string) => {
            dispatch(change({ name: 'fuel', value: value }));
          }}
          placeholder="Combustível"
          label="Combustível"
          noOptionsMessage="0 combustiveis encontrados"
          width="100%"
        />
        <Select
          options={[{
            value: '_',
            label: 'Todos',
          }, ...storeroomsList.options]}
          value={filters.storeroom}
          onChange={(value: string) => {
            dispatch(change({ name: 'storeroom', value: value }));
          }}
          placeholder="Local de Saída"
          label="Local de Saída"
          noOptionsMessage="0 locais de saída encontrados"
          width="100%"
        />
        <Select
          options={custos}
          value={filters.cost}
          onChange={(value: string) => {
            dispatch(change({ name: 'cost', value: value }));
          }}
          placeholder="Custo do Combustível"
          label="Custo do Combustível"
          width="100%"
        />
        <Select
          options={[{
            value: '_',
            label: 'Todos',
          }, ...patrimonyTypesList.options]}
          value={filters.patrimonyType}
          onChange={(value: string) => {
            dispatch(change({ name: 'patrimonyType', value: value }));
          }}
          placeholder="Tipo de Patrimônio"
          label="Tipo de Patrimônio"
          noOptionsMessage="0 tipos de patrimônio encontrados"
          width="100%"
        />
      </div>
      <Link to="analitica">
        {hasPermission('resumo_mensal_abastecimento') && 'Visão Detalhada'}
      </Link>
      <MonthlyReview
        isLoading={isDataLoading}
        title='VALORES ABASTECIDOS'
        total={fuelingMonthly.valuesTotal}
        labels={fuelingMonthly.labels}
        data={fuelingMonthly.values}
        isCurrency
      />
      <MonthlyReview
        isLoading={isDataLoading}
        title='QUANTIDADES ABASTECIDAS'
        total={fuelingMonthly.quantitiesTotal}
        labels={fuelingMonthly.labels}
        data={fuelingMonthly.quantities}
        color="#00e676"
      />
    </Container>
  );
}
