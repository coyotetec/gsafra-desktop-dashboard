/* eslint-disable @typescript-eslint/no-explicit-any */
import { format, parse } from 'date-fns';
import { FileXls } from 'phosphor-react';
import { Column } from 'primereact/column';
import { DataTableExpandedRows } from 'primereact/datatable';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { WorkBook } from 'xlsx';
import { DateInput } from '../../components/DateInput';
import { Header } from '../../components/Header';
import { Loader } from '../../components/Loader';
import FinancialViewsService from '../../services/FinancialViewsService';
import { ViewDetail } from '../../types/FinancialViews';
import { currencyFormat } from '../../utils/currencyFormat';
import { toast } from '../../utils/toast';
import { Container, Table } from './styles';

interface RangeDates {
  startDate: Date | null;
  endDate: Date | null;
}

export function FinancialViewsDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const [viewDetails, setViewDetails] = useState<ViewDetail[]>([]);
  const [expandedRows, setExpandedRows] = useState<
    any[] | DataTableExpandedRows
  >([]);

  const { id } = useParams();
  const [query] = useSearchParams();
  const startDate = query.get('startDate') as string;
  const endDate = query.get('endDate') as string;
  const name = query.get('name') as string;

  const [rangeDates, setRangeDate] = useState<RangeDates>({
    startDate:
      startDate === '_' ? null : parse(startDate, 'dd-MM-yyyy', new Date()),
    endDate: endDate === '_' ? null : parse(endDate, 'dd-MM-yyyy', new Date()),
  });

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      if (
        rangeDates.endDate &&
        rangeDates.startDate &&
        rangeDates.endDate < rangeDates.startDate
      ) {
        setIsLoading(false);
        toast({
          type: 'danger',
          text: 'Data final precisa ser maior que inicial!',
        });
        return;
      }

      const startDateParsed = rangeDates.startDate
        ? format(rangeDates.startDate, 'dd-MM-yyyy')
        : '';
      const endDateParsed = rangeDates.endDate
        ? format(rangeDates.endDate, 'dd-MM-yyyy')
        : '';

      const viewDetailsData = await FinancialViewsService.findViewDetails(
        Number(id),
        startDateParsed,
        endDateParsed,
      );

      setViewDetails(viewDetailsData);

      setIsLoading(false);
    }

    loadData();
  }, [id, rangeDates]);

  function handleExportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(
        viewDetails.map((i) => ({
          'NOME DA SEÇÃO': i.nome,
          DATA: format(new Date(i.data), 'dd/MM/yyyy'),
          VALOR: i.valor,
          'TIPO DE LANCAMENTO': i.tipoLancamento,
          DESCRIÇÃO: i.descricao,
          'CONTA BANCÁRIA': i.contaBancaria,
          PESSOA: i.pessoa,
          DOCUMENTO: i.documento,
          'TIPO DE DOCUMENTO': i.tipoDocumento,
        })),
      );

      for (let i = 2; i <= viewDetails.length + 1; i++) {
        worksheet[`B${i}`].z = 'dd"/"mm"/"yyyy';
        worksheet[`C${i}`].z = '[$R$]#,##0.00';
      }

      const workbook: WorkBook = {
        Sheets: { 'Movimentos de Conta': worksheet },
        SheetNames: ['Movimentos de Conta'],
      };
      workbook.Props = {
        Author: 'GSafra Software',
      };
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      saveAsExcelFile(
        excelBuffer,
        `INDICADOR FINANCEIRO ${
          rangeDates.startDate
            ? format(rangeDates.startDate, 'dd-MM-yyyy')
            : '-'
        } À ${rangeDates.endDate ? format(rangeDates.endDate, 'dd-MM-yyyy') : '-'}`,
      );
    });
  }

  function saveAsExcelFile(buffer: any, fileName: string) {
    import('file-saver').then((module) => {
      if (module && module.default) {
        const EXCEL_TYPE =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(data, fileName + EXCEL_EXTENSION);
      }
    });
  }

  return (
    <Container>
      <Loader isLoading={isLoading} />
      <Header title={name} subtitle="VISÃO ANALÍTICA" canGoBack />
      <div className="filters">
        <div className="date-inputs">
          <DateInput
            onChangeDate={(date) =>
              setRangeDate((prevState) => ({
                ...prevState,
                startDate: date,
              }))
            }
            placeholder="Data Inicial"
            defaultDate={
              startDate === '_'
                ? null
                : parse(startDate, 'dd-MM-yyyy', new Date())
            }
          />
          <strong>à</strong>
          <DateInput
            onChangeDate={(date) =>
              setRangeDate((prevState) => ({
                ...prevState,
                endDate: date,
              }))
            }
            placeholder="Data Final"
            defaultDate={
              endDate === '_' ? null : parse(endDate, 'dd-MM-yyyy', new Date())
            }
          />
        </div>
        <button className="export-button" onClick={handleExportExcel}>
          <FileXls size={24} color="#F7FBFE" weight="regular" />
        </button>
      </div>
      <Table
        value={viewDetails}
        rowGroupMode="subheader"
        groupRowsBy="nome"
        sortMode="single"
        sortField="nome"
        sortOrder={1}
        responsiveLayout="scroll"
        expandableRowGroups
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowGroupHeaderTemplate={(data) => <strong>{data.nome}</strong>}
        emptyMessage="Nenhum dado encontrado"
      >
        <Column
          field="data"
          header="Data"
          body={(rowData) => format(new Date(rowData.data), 'dd/MM/yyyy')}
        />
        <Column field="descricao" header="Descricao" />
        <Column
          field="valor"
          header="Valor"
          body={(rowData) => currencyFormat(rowData.valor)}
        />
        <Column field="tipoLancamento" header="D/C" />
        <Column field="pessoa" header="Pessoa" />
        <Column field="contaBancaria" header="Conta Bancaria" />
        <Column field="documento" header="Documento" />
        {/* <Column field="tipoDocumento" header="Tipo de Documento" /> */}
      </Table>
    </Container>
  );
}
