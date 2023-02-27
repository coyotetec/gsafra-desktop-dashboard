import { Container } from './styles';
import { Header } from '../../components/Header';
import SafraService from '../../services/SafraService';
import { useEffect, useMemo, useState } from 'react';
import { Select } from '../../components/Select';
import { DateInput } from '../../components/DateInput';
import { Totalizers } from './Components/Totalizers';
import { ClientAvarage } from './Components/ClientAvarage';
import { MonthlyAvarage } from './Components/MonthlyAvarage';

type optionType = {
  value: string;
  label: string;
}[];

interface RangeDates {
  startDate: Date | null;
  endDate: Date | null;
}

export function Sales() {
  const [safraOptions, setSafraOptions] = useState<optionType>([]);
  const [selectedSafra, setSelectedSafra] = useState('_');
  const [selectedStatus, setSelectedStatus] = useState('_');
  const [rangeDates, setRangeDates] = useState<RangeDates>({
    startDate: null,
    endDate: null,
  });
  const deliveryStatusOptions: optionType = [
    { value: '_', label: 'Todos' },
    { value: '1', label: 'Pendente' },
    { value: '2', label: 'Entrega Parcial' },
    { value: '3', label: 'Realizada' },
  ];
  const safraName = useMemo(() => (
    safraOptions.find((i) => i.value === selectedSafra)?.label || ''
  ), [safraOptions, selectedSafra]);

  useEffect(() => {
    async function loadSafras() {
      const safrasData = await SafraService.findSafras();

      const options = safrasData.map((safra) => ({ value: String(safra.id), label: safra.nome }));

      setSafraOptions(options);
      setSelectedSafra(options[0].value);
    }

    loadSafras();
  }, []);

  return (
    <Container>
      <Header title="Vendas da Produção" />
      <div className="filters">
        <Select
          options={safraOptions}
          value={selectedSafra}
          onChange={setSelectedSafra}
          placeholder="Safra"
          label="Safra"
          noOptionsMessage="0 safras encontrados"
          width="100%"
        />
        <Select
          options={deliveryStatusOptions}
          value={selectedStatus}
          onChange={setSelectedStatus}
          placeholder="Situação de Entrega"
          label="Situação de Entrega"
          width="100%"
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
      </div>
      <Totalizers
        safraId={selectedSafra}
        safraName={safraName}
        deliveryStatus={selectedStatus}
        rangeDates={rangeDates}
      />
      <ClientAvarage
        safraId={selectedSafra}
        safraName={safraName}
        deliveryStatus={selectedStatus}
        rangeDates={rangeDates}
      />
      <MonthlyAvarage
        safraId={selectedSafra}
        safraName={safraName}
        deliveryStatus={selectedStatus}
        rangeDates={rangeDates}
      />
    </Container>
  );
}
