/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'date-fns';
import { FileXls } from 'phosphor-react';
import { Column } from 'primereact/column';
import { DataTableExpandedRows } from 'primereact/datatable';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WorkBook } from 'xlsx';
import { DateInput } from '../../components/DateInput';
import { Header } from '../../components/Header';
import { Loader } from '../../components/Loader';
import { Select } from '../../components/Select';
import { change } from '../../redux/features/fuelingPatrimonyFiltersSlice';
import { RootState } from '../../redux/store';
import AbastecimentoService from '../../services/AbastecimentoService';
import { DetailsData } from '../../types/Abastecimento';
import { currencyFormat } from '../../utils/currencyFormat';
import { toast } from '../../utils/toast';
import { Container, Table } from './styles';

type optionType = {
  value: string;
  label: string;
}[];

export function FuelingPatrimonyDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const [patrimonyDetails, setPatrimonyDetails] = useState<DetailsData[]>([]);
  const [expandedRows, setExpandedRows] = useState<any[] | DataTableExpandedRows>([]);
  const custos: optionType = [
    { value: 'medio', label: 'Custo Médio' },
    { value: 'atual', label: 'Custo Atual' },
  ];

  const {
    fuelingPatrimonyFilters: filters,
    patrimoniesList,
    fuelsList,
    storeroomsList,
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      if (filters.rangeDates.endDate && filters.rangeDates.startDate && filters.rangeDates.endDate < filters.rangeDates.startDate) {
        setIsLoading(false);
        toast({
          type: 'danger',
          text: 'Data final precisa ser maior que inicial!'
        });
        return;
      }

      const patrimonyDetailsData = await AbastecimentoService.findDetails({
        custo: filters.cost,
        startDate: filters.rangeDates.startDate ? format(filters.rangeDates.startDate, 'dd-MM-yyyy') : '',
        endDate: filters.rangeDates.endDate ? format(filters.rangeDates.endDate, 'dd-MM-yyyy') : '',
        idPatrimonio: filters.patrimony !== '_' ? filters.patrimony : undefined,
        idProdutoAlmoxarifado: filters.fuel !== '_' ? filters.fuel : undefined,
        idAlmoxarifado: filters.storeroom !== '_' ? filters.storeroom : undefined,
      });

      setPatrimonyDetails(patrimonyDetailsData);

      setIsLoading(false);
    }

    loadData();
  }, [
    filters.cost,
    filters.rangeDates.startDate,
    filters.rangeDates.endDate,
    filters.patrimony,
    filters.fuel,
    filters.storeroom
  ]);

  function formatNumber(number: number) {
    return `${new Intl.NumberFormat('id').format(number)} lts`;
  }

  function handleExportExcel() {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(patrimonyDetails.map(i => ({
        'TIPO PATRIMONIO': i.tipoPatrimonio,
        'DATA': format(new Date(i.data), 'dd/MM/yyyy'),
        'NUMERO REQUISICAO': i.numeroRequisicao,
        'PATRIMONIO': i.patrimonio,
        'COMBUSTIVEL': i.combustivel,
        'LOCAL DE SAIDA': i.localSaida,
        'LITROS': i.quantidade,
        'CUSTO POR LITRO': i.custoIndividual,
        'TOTAL': i.total,
      })));

      for (let i = 2; i <= patrimonyDetails.length + 1; i++) {
        worksheet[`B${i}`].z = 'dd"/"mm"/"yyyy';
        worksheet[`H${i}`].z = '[$R$]#,##0.00';
        worksheet[`I${i}`].z = '[$R$]#,##0.00';
      }

      const workbook: WorkBook = {
        Sheets: { 'Movimentos de Conta': worksheet },
        SheetNames: ['Movimentos de Conta'],
      };
      workbook.Props = {
        Author: 'GSafra Software',
      };
      const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      saveAsExcelFile(
        excelBuffer,
        `RESUMO POR TIPO DE PATRIMONIO ${filters.rangeDates.startDate ? format(filters.rangeDates.startDate, 'dd-MM-yyyy') : '-'
        } À ${filters.rangeDates.endDate ? format(filters.rangeDates.endDate, 'dd-MM-yyyy') : '-'}`
      );
    });
  }

  function saveAsExcelFile(buffer: any, fileName: string) {
    import('file-saver').then(module => {
      if (module && module.default) {
        const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], {
          type: EXCEL_TYPE
        });

        module.default.saveAs(data, fileName + EXCEL_EXTENSION);
      }
    });
  }

  return (
    <Container>
      <Loader isLoading={isLoading} />
      <Header
        title="Resumo por Tipo de Patrimônio"
        subtitle="VISÃO ANALÍTICA"
        canGoBack
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
      </div>
      <button className="export-button" onClick={handleExportExcel}>
        <FileXls size={24} color="#F7FBFE" weight="regular" />
      </button>
      <Table
        value={patrimonyDetails}
        rowGroupMode="subheader"
        groupRowsBy="tipoPatrimonio"
        sortMode="single"
        sortField="tipoPatrimonio"
        sortOrder={1}
        responsiveLayout="scroll"
        expandableRowGroups
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowGroupHeaderTemplate={(data) => (
          <strong>{data.tipoPatrimonio}</strong>
        )}
        emptyMessage="Nenhum dado encontrado"
      >
        <Column field="data" header="Data" body={(rowData) => format(new Date(rowData.data), 'dd/MM/yyyy')} />
        {/* <Column field="numeroRequisicao" header="Requisição" /> */}
        <Column field="patrimonio" header="Patrimônio" />
        <Column field="combustivel" header="Combustível" />
        <Column field="localSaida" header="Local" />
        <Column field="quantidade" header="Litros" body={(rowData) => formatNumber(rowData.quantidade)} />
        <Column field="custoIndividual" header="Custo por Litro" body={(rowData) => currencyFormat(rowData.custoIndividual)} />
        <Column field="total" header="Total" body={(rowData) => currencyFormat(rowData.total)} />
      </Table>
    </Container>
  );
}
