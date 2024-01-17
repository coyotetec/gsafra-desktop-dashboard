import { Container } from './styles';
import { Header } from '../../components/Header';
import SafraService from '../../services/SafraService';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Select } from '../../components/Select';
import { DateInput } from '../../components/DateInput';
import { Totalizers } from './Components/Totalizers';
import { ClientAvarage } from './Components/ClientAvarage';
import { MonthlyAvarage } from './Components/MonthlyAvarage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { hasToFetch } from '../../utils/hasToFetch';
import { setSafrasData } from '../../redux/features/safrasListSlice';
import { change, setFirstSafra } from '../../redux/features/salesFiltersSlice';
import { componentsRefType } from '../../types/Types';

type optionType = {
  value: string;
  label: string;
}[];

export function Sales() {
  const deliveryStatusOptions: optionType = [
    { value: '_', label: 'Todos' },
    { value: '1', label: 'Pendente' },
    { value: '2', label: 'Entrega Parcial' },
    { value: '3', label: 'Realizada' },
  ];
  const totalizersRef = useRef<componentsRefType>({
    loadData: () => null,
  });
  const clientAvarageRef = useRef<componentsRefType>({
    loadData: () => null,
  });
  const monthlyAvarageRef = useRef<componentsRefType>({
    loadData: () => null,
  });

  const {
    safrasList,
    salesFilters: { safra, deliveryStatus, rangeDates },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const refreshData = useCallback(() => {
    totalizersRef.current.loadData();
    clientAvarageRef.current.loadData();
    monthlyAvarageRef.current.loadData();
  }, []);

  const safraName = useMemo(
    () => safrasList.options.find((i) => i.value === safra)?.label || '',
    [safrasList.options, safra],
  );

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

      dispatch(setFirstSafra(safrasList.options[0]?.value || '_'));
    }

    loadSafras();
  }, [dispatch, safrasList.lastFetch, safrasList.options]);

  return (
    <Container>
      <Header title="Vendas da Produção" refreshData={refreshData} />
      <div className="filters">
        <Select
          options={safrasList.options}
          value={safra}
          onChange={(value: string) => {
            dispatch(change({ name: 'safra', value }));
          }}
          placeholder="Safra"
          label="Safra"
          noOptionsMessage="0 safras encontrados"
          width="100%"
        />
        <Select
          options={deliveryStatusOptions}
          value={deliveryStatus}
          onChange={(value: string) => {
            dispatch(change({ name: 'deliveryStatus', value }));
          }}
          placeholder="Situação de Entrega"
          label="Situação de Entrega"
          width="100%"
        />
        <div className="date-filter">
          <DateInput
            onChangeDate={(date) => {
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
      </div>
      <Totalizers ref={totalizersRef} safraName={safraName} />
      <ClientAvarage ref={clientAvarageRef} safraName={safraName} />
      <MonthlyAvarage ref={monthlyAvarageRef} safraName={safraName} />
    </Container>
  );
}
