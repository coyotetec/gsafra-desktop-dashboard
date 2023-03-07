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
import ProdutoAlmoxarifadoService from '../../services/ProdutoAlmoxarifadoService';
import TipoPatrimonioService from '../../services/TipoPatrimonioService';
import { toast } from '../../utils/toast';
import { MonthlyReview } from './components/MonthlyReview';
import { Container } from './styles';

type optionType = {
  value: string;
  label: string;
}[];

export function FuelingMonthlyReview() {
  const [startDate, setStartDate] = useState<Date | null>(subMonths(new Date(), 12));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [patrimonios, setPatrimonios] = useState<optionType>([]);
  const [selectedPatrimonio, setSelectedPatrimonio] = useState('_');
  const [combustiveis, setCombustiveis] = useState<optionType>([]);
  const [selectedCombustivel, setSelectedCombustivel] = useState('_');
  const [almoxarifados, setAlmoxarifados] = useState<optionType>([]);
  const [selectedAlmoxarifado, setSelectedAlmoxarifado] = useState('_');
  const [tiposPatrimonio, setTiposPatrimonio] = useState<optionType>([]);
  const [selectedTipoPatrimonio, setSelectedTipoPatrimonio] = useState('_');
  const [selectedCusto, setSelectedCusto] = useState('medio');
  const custos: optionType = [
    { value: 'medio', label: 'Custo Médio' },
    { value: 'atual', label: 'Custo Atual' },
  ];
  const [monthlyValuesLabels, setMonthlyValuesLabels] = useState<string[]>([]);
  const [monthlyValuesData, setMonthlyValuesData] = useState<number[]>([]);
  const [monthlyValuesTotal, setMonthlyValuesTotal] = useState(0);
  const [monthlyQtysLabels, setMonthlyQtysLabels] = useState<string[]>([]);
  const [monthlyQtysData, setMonthlyQtysData] = useState<number[]>([]);
  const [monthlyQtysTotal, setMonthlyQtysTotal] = useState(0);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);


  const { hasPermission } = useContext(UserContext);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      const [
        patrimoniosData,
        combustiveisData,
        almoxarifadosData,
        tiposPatrimonioData
      ] = await Promise.all([
        PatrimonioService.findPatrimonios(),
        ProdutoAlmoxarifadoService.findCombustiveis(),
        AlmoxarifadoService.findAlmoxarifados(),
        TipoPatrimonioService.findTiposPatrimonio()
      ]);

      const patrimoniosOptions = patrimoniosData.map(item => (
        { value: String(item.id), label: item.descricao }
      ));
      patrimoniosOptions.unshift({ value: '_', label: 'Todos' });

      const combustiveisOptions = combustiveisData.map(item => (
        { value: String(item.id), label: item.nome }
      ));
      combustiveisOptions.unshift({ value: '_', label: 'Todos' });

      const almoxarifadosOptions = almoxarifadosData.map(item => (
        { value: String(item.id), label: item.nome }
      ));
      almoxarifadosOptions.unshift({ value: '_', label: 'Todos' });

      const tiposPatrimonioOptions = tiposPatrimonioData.map(item => (
        { value: String(item.id), label: item.nome }
      ));
      tiposPatrimonioOptions.unshift({ value: '_', label: 'Todos' });

      setPatrimonios(patrimoniosOptions);
      setCombustiveis(combustiveisOptions);
      setAlmoxarifados(almoxarifadosOptions);
      setTiposPatrimonio(tiposPatrimonioOptions);

      setIsLoading(false);
    }

    loadData();
  }, []);

  useEffect(() => {
    async function loadData() {
      if (hasPermission('resumo_mensal_abastecimento')) {
        setIsDataLoading(true);

        if (endDate && startDate && endDate < startDate) {
          setIsDataLoading(false);
          setMonthlyValuesData([]);
          setMonthlyValuesTotal(0);
          setMonthlyQtysData([]);
          setMonthlyQtysTotal(0);
          toast({
            type: 'danger',
            text: 'Data final precisa ser maior que inicial!'
          });
          return;
        }

        const monthlyReviewData = await AbastecimentoService.findMonthlyReview({
          custo: selectedCusto,
          startDate: startDate ? format(startDate, 'dd-MM-yyyy') : '',
          endDate: endDate ? format(endDate, 'dd-MM-yyyy') : '',
          idPatrimonio: selectedPatrimonio !== '_' ? selectedPatrimonio : undefined,
          idProdutoAlmoxarifado: selectedCombustivel !== '_' ? selectedCombustivel : undefined,
          idAlmoxarifado: selectedAlmoxarifado !== '_' ? selectedAlmoxarifado : undefined,
          idTipoPatrimonio: selectedTipoPatrimonio !== '_' ? selectedTipoPatrimonio : undefined,
        });

        setMonthlyValuesLabels(monthlyReviewData.monthlyValue.map(item => item.month));
        setMonthlyValuesData(monthlyReviewData.monthlyValue.map(item => item.value));
        setMonthlyValuesTotal(monthlyReviewData.monthlyValueTotal);
        setMonthlyQtysLabels(monthlyReviewData.monthlyQty.map(item => item.month));
        setMonthlyQtysData(monthlyReviewData.monthlyQty.map(item => item.value));
        setMonthlyQtysTotal(monthlyReviewData.monthlyQtyTotal);
      }

      setIsDataLoading(false);
    }

    loadData();
  }, [hasPermission, selectedCusto, startDate, endDate, selectedPatrimonio, selectedCombustivel, selectedAlmoxarifado, selectedTipoPatrimonio]);


  return (
    <Container>
      <Loader isLoading={isLoading} />
      <Header title="Resumo Mensal de Abastecimento" />
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
          options={combustiveis}
          value={selectedCombustivel}
          onChange={setSelectedCombustivel}
          placeholder="Combustível"
          label="Combustível"
          noOptionsMessage="0 combustiveis encontrados"
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
        }&idCombustivel=${selectedCombustivel
        }&idAlmoxarifado=${selectedAlmoxarifado
        }&idTipoPatrimonio=${selectedTipoPatrimonio}`}
      >
        {hasPermission('resumo_mensal_abastecimento') && 'Visão Detalhada'}
      </Link>
      <MonthlyReview
        isLoading={isDataLoading}
        title='VALORES ABASTECIDOS'
        total={monthlyValuesTotal}
        labels={monthlyValuesLabels}
        data={monthlyValuesData}
        isCurrency
      />
      <MonthlyReview
        isLoading={isDataLoading}
        title='QUANTIDADES ABASTECIDAS'
        total={monthlyQtysTotal}
        labels={monthlyQtysLabels}
        data={monthlyQtysData}
        color="#00e676"
      />
    </Container>
  );
}
