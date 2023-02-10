import { Info } from 'phosphor-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateInput } from '../../components/DateInput';
import { Header } from '../../components/Header';
import { MultiSelect } from '../../components/MultiSelect';
import { Select } from '../../components/Select';
import useAnimatedUnmount from '../../hooks/useAnimatedUnmount';
import SafraService from '../../services/SafraService';
import TalhaoService from '../../services/TalhaoService';
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

interface RangeDates {
  startDate: Date | null;
  endDate: Date | null;
}

export function ProductionCost() {
  const [safrasOptions, setSafraOptions] = useState<optionType>([]);
  const [selectedSafrasOptions, setSelectedSafrasOptions] = useState<optionType>([]);
  const [selectedSafras, setSelectedSafras] = useState<string[]>([]);
  const [lastSelectedSafras, setLastSelectedSafras] = useState<string[]>([]);
  const [talhoesOptions, setTalhoesOptions] = useState<groupedOptionsType>([]);
  const [selectedTalhao, setSelectedTalhao] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState('cost');
  const [rangeDates, setRangeDates] = useState<RangeDates>({
    startDate: null,
    endDate: null,
  });
  const unitOptions: optionType = [
    { value: 'cost', label: 'Custo (R$)' },
    { value: 'hectareCost', label: 'Custo por Hectare (R$/ha)' },
    { value: 'percent', label: 'Porcentagem (%)' },
  ];

  const hectareCostMessageVisible = useMemo(() => (
    selectedUnit === 'hectareCost' && lastSelectedSafras.length > 1
  ), [lastSelectedSafras, selectedUnit]);

  const {
    shouldRender,
    animatedElementRef
  } = useAnimatedUnmount(hectareCostMessageVisible);

  const loadTalhoes = useCallback(async (value: string[]) => {
    setSelectedTalhao(null);

    if (JSON.stringify(lastSelectedSafras) === JSON.stringify(value)) {
      return;
    }

    const parsedSafras = value.join(',');
    setLastSelectedSafras(value);
    setSelectedSafrasOptions(value.map((i) => {
      const safra = safrasOptions.find((option) => option.value === i) as {
        value: string;
        label: string;
      };

      return safra;
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

    setTalhoesOptions(groupedTalhoes);
  }, [lastSelectedSafras, safrasOptions]);

  useEffect(() => {
    async function loadSafras() {
      const safrasData = await SafraService.findSafras();

      const options = safrasData.map((safra) => ({ value: String(safra.id), label: safra.nome }));
      const initialState = options.length > 0 ? [options[0].value] : [];

      setSafraOptions(options);
      setSelectedSafras(initialState);

      loadTalhoes(initialState);
    }

    loadSafras();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Header
        title="Custo da Produção"
      />
      <div className="filters">
        <MultiSelect
          options={safrasOptions}
          onChange={setSelectedSafras}
          value={selectedSafras}
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
          value={selectedTalhao}
          onChange={setSelectedTalhao}
          label="Talhão"
          width="100%"
          isGrouped
        />
        <div className="date-filter">
          <DateInput
            onChangeDate={(date) => setRangeDates((prevState) => ({
              ...prevState,
              startDate: date
            }))}
            placeholder='Data Inicial'
            defaultDate={null}
            height="48px"
            width="100%"
            fontSize="16px"
            horizontalPadding="12px"
            label="Data Inicial"
          />
          <strong>à</strong>
          <DateInput
            onChangeDate={(date) => setRangeDates((prevState) => ({
              ...prevState,
              endDate: date
            }))}
            placeholder='Data Final'
            defaultDate={null}
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
          value={selectedUnit}
          onChange={setSelectedUnit}
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
      <CategoryCost
        safraIds={lastSelectedSafras}
        talhaoId={selectedTalhao}
        rangeDates={rangeDates}
        unit={selectedUnit}
      />
      <TalhaoCost
        safraIds={lastSelectedSafras}
        rangeDates={rangeDates}
        unit={selectedUnit}
        safraOptions={selectedSafrasOptions}
      />
      <Activity
        safraIds={lastSelectedSafras}
        talhaoId={selectedTalhao}
        rangeDates={rangeDates}
        unit={selectedUnit}
      />
      <Maintenance
        safraIds={lastSelectedSafras}
        talhaoId={selectedTalhao}
        rangeDates={rangeDates}
        unit={selectedUnit}
      />
      <Fueling
        safraIds={lastSelectedSafras}
        talhaoId={selectedTalhao}
        rangeDates={rangeDates}
        unit={selectedUnit}
      />
    </Container>
  );
}
