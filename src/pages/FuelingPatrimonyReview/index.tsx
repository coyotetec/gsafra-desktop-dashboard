import { format, subMonths } from 'date-fns';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DateInput } from '../../components/DateInput';
import { Header } from '../../components/Header';
import { Loader } from '../../components/Loader';
import { Select } from '../../components/Select';
import { useUserContext } from '../../contexts/UserContext';
import AbastecimentoService from '../../services/AbastecimentoService';
import AlmoxarifadoService from '../../services/AlmoxarifadoService';
import PatrimonioService from '../../services/PatrimonioService';
import ProdutoAlmoxarifadoService from '../../services/ProdutoAlmoxarifadoService';
import { toast } from '../../utils/toast';
import { PatrimonyReview } from './components/PatrimonyReview';
import { Container } from './styles';

type optionType = {
  value: string;
  label: string;
}[];

export function FuelingPatrimonyReview() {
  const [startDate, setStartDate] = useState<Date | null>(subMonths(new Date(), 12));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [patrimonios, setPatrimonios] = useState<optionType>([]);
  const [selectedPatrimonio, setSelectedPatrimonio] = useState('_');
  const [combustiveis, setCombustiveis] = useState<optionType>([]);
  const [selectedCombustivel, setSelectedCombustivel] = useState('_');
  const [almoxarifados, setAlmoxarifados] = useState<optionType>([]);
  const [selectedAlmoxarifado, setSelectedAlmoxarifado] = useState('_');
  const [selectedCusto, setSelectedCusto] = useState('medio');
  const custos: optionType = [
    { value: 'medio', label: 'Custo Médio' },
    { value: 'atual', label: 'Custo Atual' },
  ];
  const [patrimonyValuesLabels, setPatrimonyValuesLabels] = useState<string[]>([]);
  const [patrimonyValuesData, setPatrimonyValuesData] = useState<number[]>([]);
  const [patrimonyValuesTotal, setPatrimonyValuesTotal] = useState(0);
  const [patrimonyQtysLabels, setPatrimonyQtysLabels] = useState<string[]>([]);
  const [patrimonyQtysData, setPatrimonyQtysData] = useState<number[]>([]);
  const [patrimonyQtysTotal, setPatrimonyQtysTotal] = useState(0);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const { hasPermission } = useUserContext();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      const [
        patrimoniosData,
        combustiveisData,
        almoxarifadosData,
      ] = await Promise.all([
        PatrimonioService.findPatrimonios(),
        ProdutoAlmoxarifadoService.findCombustiveis(),
        AlmoxarifadoService.findAlmoxarifados()
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

      setPatrimonios(patrimoniosOptions);
      setCombustiveis(combustiveisOptions);
      setAlmoxarifados(almoxarifadosOptions);

      setIsLoading(false);
    }

    loadData();
  }, []);

  useEffect(() => {
    async function loadData() {
      if (hasPermission('resumo_patrimonio_abastecimento')) {
        setIsDataLoading(true);

        if (endDate && startDate && endDate < startDate) {
          setIsDataLoading(false);
          setPatrimonyValuesData([]);
          setPatrimonyValuesTotal(0);
          setPatrimonyQtysData([]);
          setPatrimonyQtysTotal(0);
          toast({
            type: 'danger',
            text: 'Data final precisa ser maior que inicial!'
          });
          return;
        }

        const patrimonyReviewData = await AbastecimentoService.findPatrimonyReview({
          custo: selectedCusto,
          startDate: startDate ? format(startDate, 'dd-MM-yyyy') : '',
          endDate: endDate ? format(endDate, 'dd-MM-yyyy') : '',
          idPatrimonio: selectedPatrimonio !== '_' ? selectedPatrimonio : undefined,
          idProdutoAlmoxarifado: selectedCombustivel !== '_' ? selectedCombustivel : undefined,
          idAlmoxarifado: selectedAlmoxarifado !== '_' ? selectedAlmoxarifado : undefined,
        });

        setPatrimonyValuesLabels(patrimonyReviewData.patrimonyValue.map(item => item.tipoPatrimonio));
        setPatrimonyValuesData(patrimonyReviewData.patrimonyValue.map(item => item.total));
        setPatrimonyValuesTotal(patrimonyReviewData.patrimonyValueTotal);
        setPatrimonyQtysLabels(patrimonyReviewData.patrimonyQty.map(item => item.tipoPatrimonio));
        setPatrimonyQtysData(patrimonyReviewData.patrimonyQty.map(item => item.total));
        setPatrimonyQtysTotal(patrimonyReviewData.patrimonyQtyTotal);
      }

      setIsDataLoading(false);
    }

    loadData();
  }, [hasPermission, selectedCusto, startDate, endDate, selectedPatrimonio, selectedCombustivel, selectedAlmoxarifado]);

  return (
    <Container>
      <Loader isLoading={isLoading} />
      <Header title="Resumo por Tipo de Patrimônio" />
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
      </div>
      <Link
        to={`analitica?custo=${selectedCusto}&startDate=${startDate ? format(startDate, 'dd-MM-yyyy') : '_'
        }&endDate=${endDate ? format(endDate, 'dd-MM-yyyy') : '_'
        }&idPatrimonio=${selectedPatrimonio
        }&idCombustivel=${selectedCombustivel
        }&idAlmoxarifado=${selectedAlmoxarifado}`}
      >
        {hasPermission('resumo_patrimonio_abastecimento') && 'Visão Detalhada'}
      </Link>
      <PatrimonyReview
        isLoading={isDataLoading}
        title='VALORES ABASTECIDOS'
        total={patrimonyValuesTotal}
        labels={patrimonyValuesLabels}
        data={patrimonyValuesData}
        isCurrency
      />
      <PatrimonyReview
        isLoading={isDataLoading}
        title='LITROS ABASTECIDOS'
        total={patrimonyQtysTotal}
        labels={patrimonyQtysLabels}
        data={patrimonyQtysData}
      />
    </Container>
  );
}
