/* eslint-disable @typescript-eslint/no-explicit-any */
import { format, parse } from 'date-fns';
import { FileXls } from 'phosphor-react';
import { Column } from 'primereact/column';
import { DataTableExpandedRows } from 'primereact/datatable';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { WorkBook } from 'xlsx';
import { DateInput } from '../../components/DateInput';
import { Header } from '../../components/Header';
import { Loader } from '../../components/Loader';
import { Select } from '../../components/Select';
import SafraService from '../../services/SafraService';
import VendaService from '../../services/VendaService';
import { Romaneio } from '../../types/Venda';
import { toast } from '../../utils/toast';
import { Container, Table } from './styles';

type optionType = {
  value: string;
  label: string;
}[];

interface RangeDates {
  startDate: Date | null;
  endDate: Date | null;
}

export function SalesPackingList() {
  const [isLoading, setIsLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<any[] | DataTableExpandedRows>([]);
  const [packingList, setPackingList] = useState<Romaneio[]>([]);
  const [safraOptions, setSafraOptions] = useState<optionType>([]);
  const deliveryStatusOptions: optionType = [
    { value: '_', label: 'Todos' },
    { value: '1', label: 'Pendente' },
    { value: '2', label: 'Entrega Parcial' },
    { value: '3', label: 'Realizada' },
  ];

  const [query] = useSearchParams();
  const safraIdParam = query.get('safraId') as string;
  const statusParam = query.get('status') as string;
  const startDateParam = query.get('startDate') as string;
  const endDateParam = query.get('endDate') as string;

  const [selectedSafra, setSelectedSafra] = useState(safraIdParam);
  const [selectedStatus, setSelectedStatus] = useState(statusParam);
  const [rangeDates, setRangeDates] = useState<RangeDates>({
    startDate: startDateParam === '_' ? null : parse(startDateParam, 'dd-MM-yyyy', new Date()),
    endDate: endDateParam === '_' ? null : parse(endDateParam, 'dd-MM-yyyy', new Date()),
  });

  useEffect(() => {
    async function loadSafras() {
      setIsLoading(true);

      const safrasData = await SafraService.findSafras();

      const options = safrasData.map((safra) => ({ value: String(safra.id), label: safra.nome }));

      setSafraOptions(options);
      setIsLoading(true);
    }

    loadSafras();
  }, []);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      if (selectedSafra === '_') {
        setIsLoading(false);
        return;
      }

      if (rangeDates.endDate && rangeDates.startDate && rangeDates.endDate < rangeDates.startDate) {
        setIsLoading(false);
        toast({
          type: 'danger',
          text: 'Data final precisa ser maior que inicial!'
        });
        return;
      }

      const deliveryStatusParsed = selectedStatus !== '_' ? selectedStatus : '';
      const startDateParsed = rangeDates.startDate ? format(rangeDates.startDate, 'dd-MM-yyyy') : '';
      const endDateParsed = rangeDates.endDate ? format(rangeDates.endDate, 'dd-MM-yyyy') : '';

      const clientAvarageData = await VendaService.findRomaneios({
        safraId: Number(selectedSafra),
        deliveryStatus: deliveryStatusParsed,
        startDate: startDateParsed,
        endDate: endDateParsed,
      });

      setPackingList(clientAvarageData);
      setIsLoading(false);
    }

    loadData();
  }, [selectedSafra, selectedStatus, rangeDates]);

  function formatNumber(number: number, sufix?: string) {
    return `${new Intl.NumberFormat('id', {
      maximumFractionDigits: 2,
    }).format(number)}${sufix ? sufix : ''}`;
  }

  function handleExportExcel() {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(packingList.map(i => ({
        'CLIENTE': i.cliente,
        'DATA': format(new Date(i.data), 'dd/MM/yyyy'),
        'NUMERO ROMANEIO': i.numeroOrdem,
        'QUANTIDADE': i.quantidade,
        'LOCAL DE SAIDA': i.localSaida,
        'MOTORISTA': i.motorista,
        'PLACA': i.placa,
      })));

      for (let i = 2; i <= packingList.length + 1; i++) {
        worksheet[`B${i}`].z = 'dd"/"mm"/"yyyy';
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
        `ROMANEIOS DA SAFRA ${safraOptions.find((i) => i.value === selectedSafra)?.label}`
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
        title="Resumo Mensal de Abastecimento"
        subtitle="VISÃO ANALÍTICA"
        canGoBack
      />
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
      <button className="export-button" onClick={handleExportExcel}>
        <FileXls size={24} color="#F7FBFE" weight="regular" />
      </button>
      <Table
        value={packingList}
        rowGroupMode="subheader"
        groupRowsBy="cliente"
        responsiveLayout="scroll"
        expandableRowGroups
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowGroupHeaderTemplate={(data) => (
          <strong>{data.cliente}</strong>
        )}
        emptyMessage="Nenhum dado encontrado"
      >
        <Column field="data" header="Data" body={(rowData) => format(new Date(rowData.data), 'dd/MM/yyyy')} />
        <Column field="numeroOrdem" header="Romaneio" />
        <Column field="quantidade" header="Quantidade" body={(rowData) => formatNumber(rowData.quantidade, ' Kg')} />
        <Column field="localSaida" header="Local de Saída" />
        <Column field="motorista" header="Motorista" />
        <Column field="placa" header="Placa" />
      </Table>
    </Container>
  );
}
