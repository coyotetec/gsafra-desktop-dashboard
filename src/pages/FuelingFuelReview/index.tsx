import { format, subMonths } from 'date-fns';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../components/App';
import { DateInput } from '../../components/DateInput';
import { Header } from '../../components/Header';
import { Loader } from '../../components/Loader';
import { Select } from '../../components/Select';
import AbastecimentoService from '../../services/AbastecimentoService';
import AlmoxarifadoService from '../../services/AlmoxarifadoService';
import PatrimonioService from '../../services/PatrimonioService';
import TipoPatrimonioService from '../../services/TipoPatrimonioService';
import { FuelReview } from './components/FuelReview';
import { Container } from './styles';

type optionType = {
  value: string;
  label: string;
}[];

export function FuelingFuelReview() {
  const [startDate, setStartDate] = useState<Date | null>(subMonths(new Date(), 12));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [patrimonios, setPatrimonios] = useState<optionType>([]);
  const [selectedPatrimonio, setSelectedPatrimonio] = useState('_');
  const [almoxarifados, setAlmoxarifados] = useState<optionType>([]);
  const [selectedAlmoxarifado, setSelectedAlmoxarifado] = useState('_');
  const [tiposPatrimonio, setTiposPatrimonio] = useState<optionType>([]);
  const [selectedTipoPatrimonio, setSelectedTipoPatrimonio] = useState('_');
  const [selectedCusto, setSelectedCusto] = useState('medio');
  const custos: optionType = [
    { value: 'medio', label: 'Custo Médio' },
    { value: 'atual', label: 'Custo Atual' },
  ];
  const [fuelValuesLabels, setFuelValuesLabels] = useState<string[]>([]);
  const [fuelValuesData, setFuelValuesData] = useState<number[]>([]);
  const [fuelValuesTotal, setFuelValuesTotal] = useState(0);
  const [fuelQtysLabels, setFuelQtysLabels] = useState<string[]>([]);
  const [fuelQtysData, setFuelQtysData] = useState<number[]>([]);
  const [fuelQtysTotal, setFuelQtysTotal] = useState(0);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const { hasPermission } = useContext(UserContext);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      const patrimoniosData = await PatrimonioService.findPatrimonios();
      const almoxarifadosData = await AlmoxarifadoService.findAlmoxarifados();
      const tiposPatrimonioData = await TipoPatrimonioService.findTiposPatrimonio();

      const patrimoniosOptions = patrimoniosData.map(item => (
        { value: String(item.id), label: item.descricao }
      ));
      patrimoniosOptions.unshift({ value: '_', label: 'Todos' });

      const almoxarifadosOptions = almoxarifadosData.map(item => (
        { value: String(item.id), label: item.nome }
      ));
      almoxarifadosOptions.unshift({ value: '_', label: 'Todos' });

      const tiposPatrimonioOptions = tiposPatrimonioData.map(item => (
        { value: String(item.id), label: item.nome }
      ));
      tiposPatrimonioOptions.unshift({ value: '_', label: 'Todos' });

      setPatrimonios(patrimoniosOptions);
      setAlmoxarifados(almoxarifadosOptions);
      setTiposPatrimonio(tiposPatrimonioOptions);

      setIsLoading(false);
    }

    loadData();
  }, []);

  useEffect(() => {
    async function loadData() {
      if (hasPermission('resumo_combustivel_abastecimento')) {
        setIsDataLoading(true);

        const fuelReviewData = await AbastecimentoService.findFuelReview({
          custo: selectedCusto,
          startDate: startDate ? format(startDate, 'dd-MM-yyyy') : '',
          endDate: endDate ? format(endDate, 'dd-MM-yyyy') : '',
          idPatrimonio: selectedPatrimonio !== '_' ? selectedPatrimonio : undefined,
          idAlmoxarifado: selectedAlmoxarifado !== '_' ? selectedAlmoxarifado : undefined,
          idTipoPatrimonio: selectedTipoPatrimonio !== '_' ? selectedTipoPatrimonio : undefined,
        });

        setFuelValuesLabels(fuelReviewData.fuelValue.map(item => item.combustivel));
        setFuelValuesData(fuelReviewData.fuelValue.map(item => item.total));
        setFuelValuesTotal(fuelReviewData.fuelValueTotal);
        setFuelQtysLabels(fuelReviewData.fuelQty.map(item => item.combustivel));
        setFuelQtysData(fuelReviewData.fuelQty.map(item => item.total));
        setFuelQtysTotal(fuelReviewData.fuelQtyTotal);
      }

      setIsDataLoading(false);
    }

    loadData();
  }, [hasPermission, selectedCusto, startDate, endDate, selectedPatrimonio, selectedAlmoxarifado, selectedTipoPatrimonio]);

  return (
    <Container>
      <Loader isLoading={isLoading} />
      <Header title="Resumo por Combustível" />
      <div className="filters">
        <div className="date-filter">
          <DateInput
            onChangeDate={(date) => setStartDate(date)}
            placeholder='Data Inicial'
            defaultDate={subMonths(new Date(), 12)}
            height="48px"
            width="100%"
            fontSize="16px"
            horizontalPadding="12px"
            label="Data Inicial"
          />
          <strong>à</strong>
          <DateInput
            onChangeDate={(date) => setEndDate(date)}
            placeholder='Data Final'
            defaultDate={new Date()}
            height="48px"
            width="100%"
            fontSize="16px"
            horizontalPadding="12px"
            label="Data Final"
          />
        </div>

        <Select
          options={patrimonios}
          value={selectedPatrimonio}
          onChange={setSelectedPatrimonio}
          placeholder="Patrimonio"
          label="Patrimonio"
          noOptionsMessage="0 patrimonios encontrados"
          width="100%"
        />
        <Select
          options={almoxarifados}
          value={selectedAlmoxarifado}
          onChange={setSelectedAlmoxarifado}
          placeholder="Local de Saída"
          label="Local de Saída"
          noOptionsMessage="0 locais de saída encontrados"
          width="100%"
        />

        <Select
          options={custos}
          value={selectedCusto}
          onChange={setSelectedCusto}
          placeholder="Custo do Combustível"
          label="Custo do Combustível"
          width="100%"
        />

        <Select
          options={tiposPatrimonio}
          value={selectedTipoPatrimonio}
          onChange={setSelectedTipoPatrimonio}
          placeholder="Tipo de Patrimônio"
          label="Tipo de Patrimônio"
          noOptionsMessage="0 tipos de patrimônio encontrados"
          width="100%"
        />
      </div>
      <Link
        to={`analitica?custo=${selectedCusto}&startDate=${startDate ? format(startDate, 'dd-MM-yyyy') : '_'
        }&endDate=${endDate ? format(endDate, 'dd-MM-yyyy') : '_'
        }&idPatrimonio=${selectedPatrimonio
        }&idAlmoxarifado=${selectedAlmoxarifado
        }&idTipoPatrimonio=${selectedTipoPatrimonio}`}
      >
        {hasPermission('resumo_combustivel_abastecimento') && 'Visão Detalhada'}
      </Link>
      <div className="cards">
        <FuelReview
          isLoading={isDataLoading}
          title='VALORES ABASTECIDOS'
          total={fuelValuesTotal}
          labels={fuelValuesLabels}
          data={fuelValuesData}
          isCurrency
        />
        <FuelReview
          isLoading={isDataLoading}
          title='LITROS ABASTECIDOS'
          total={fuelQtysTotal}
          labels={fuelQtysLabels}
          data={fuelQtysData}
        />
      </div>
    </Container>
  );
}
