/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataTableExpandedRows } from 'primereact/datatable';

import { Header } from '../../components/Header';
import { Loader } from '../../components/Loader';
import MovimentoContaService from '../../services/MovimentoContaService';
import { MovimentoContas } from '../../types/MovimentoContas';
import { Container, Table } from './styles';
import { Column } from 'primereact/column';
import { format, parse } from 'date-fns';
import { currencyFormat } from '../../utils/currencyFormat';
import { DateInput } from '../../components/DateInput';
import { ChartAccountsSelect } from '../../components/ChartAccoutsSelect';
import { TreeSelectSelectionKeys } from 'primereact/treeselect';
import { FileXls } from 'phosphor-react';
import { WorkBook } from 'xlsx';

interface RangeDates {
  startDate: Date;
  endDate: Date;
}

export function AccountMovements() {
  const [isLoading, setIsLoading] = useState(true);
  const [accountMovements, setAccountMovements] = useState<MovimentoContas[]>([]);
  const [expandedRows, setExpandedRows] = useState<any[] | DataTableExpandedRows>([]);

  const [query] = useSearchParams();
  const type = query.get('type') as 'credit' | 'debit';
  const codigo = query.get('codigo') as string;
  const startDate = query.get('startDate') as string;
  const endDate = query.get('endDate') as string;
  const safraId = query.get('safraId') as string;

  const [selectedSafra, setSelectedSafra] = useState(safraId);
  const [selectedChartAccount, setSelectedChartAccount] = useState<TreeSelectSelectionKeys>(codigo);
  const [rangeDates, setRangeDate] = useState<RangeDates>({
    startDate: parse(startDate, 'dd-MM-yyyy', new Date()),
    endDate: parse(endDate, 'dd-MM-yyyy', new Date()),
  });

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      if (!rangeDates.startDate || !rangeDates.endDate) {
        return;
      }

      if (rangeDates.endDate < rangeDates.startDate) {
        return;
      }

      const startDateParsed = format(rangeDates.startDate, 'dd-MM-yyyy');
      const endDateParsed = format(rangeDates.endDate, 'dd-MM-yyyy');

      const accountMovementsData = await MovimentoContaService.findMovimentoContas(
        String(selectedChartAccount),
        startDateParsed,
        endDateParsed,
        selectedSafra !== '_' ? selectedSafra : undefined
      );
      setAccountMovements(accountMovementsData);
      setIsLoading(false);
    }

    loadData();
  }, [selectedChartAccount, rangeDates, selectedSafra]);

  function handleExportExcel() {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(accountMovements.map(i => ({
        'PLANO DE CONTA': i.planoConta,
        'DATA': format(new Date(i.data), 'dd/MM/yyyy'),
        'VALOR TOTAL': i.valorTotal,
        'VALOR APROPRIADO': i.valorApropriado,
        'DESCRICAO': i.descricao,
        'CONTA BANCÁRIA': i.contaBancaria,
        'PESSOA': i.pessoa,
        'DOCUMENTO': i.documento,
        'TIPO DE DOCUMENTO': i.tipoDocumento
      })));

      for(let i = 2; i <= accountMovements.length + 1; i++) {
        worksheet[`B${i}`].z = 'dd"/"mm"/"yyyy';
        worksheet[`C${i}`].z = '[$R$]#,##0.00';
        worksheet[`D${i}`].z = '[$R$]#,##0.00';
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
        `MOVIMENTOS DE CONTA ${format(rangeDates.startDate, 'dd-MM-yyyy')} À ${format(rangeDates.endDate, 'dd-MM-yyyy')}`
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
        selectedSafra={selectedSafra}
        setChangeSafra={setSelectedSafra}
        title={`${type === 'credit' ? 'Créditos' : 'Debitos'} Compensados`}
        subtitle="VISÃO ANALÍTICA"
        canGoBack
      />
      <div className="filters">
        <ChartAccountsSelect
          type={type}
          selected={selectedChartAccount}
          setSelected={setSelectedChartAccount}
        />
        <div>
          <div className="date-inputs">
            <DateInput
              onChangeDate={(date) => setRangeDate((prevState) => ({
                ...prevState,
                startDate: date
              }))}
              placeholder='Data Inicial'
              defaultDate={parse(startDate, 'dd-MM-yyyy', new Date())}
            />
            <strong>à</strong>
            <DateInput
              onChangeDate={(date) => setRangeDate((prevState) => ({
                ...prevState,
                endDate: date
              }))}
              placeholder='Data Final'
              defaultDate={parse(endDate, 'dd-MM-yyyy', new Date())}
            />
          </div>
          <button className="export-button" onClick={handleExportExcel}>
            <FileXls size={24} color="#F7FBFE" weight="regular" />
          </button>
        </div>
      </div>
      <Table
        value={accountMovements}
        rowGroupMode="subheader"
        groupRowsBy="planoConta"
        sortMode="single"
        sortField="planoConta"
        sortOrder={1}
        responsiveLayout="scroll"
        expandableRowGroups
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowGroupHeaderTemplate={(data) => (
          <strong>{data.planoConta}</strong>
        )}
        emptyMessage="Nenhum dado encontrado"
      >
        <Column field="data" header="Data" body={(rowData) => format(new Date(rowData.data), 'dd/MM/yyyy')} />
        <Column field="descricao" header="Descricao" />
        <Column field="valorTotal" header="Valor Total" body={(rowData) => currencyFormat(rowData.valorTotal)} />
        <Column field="valorApropriado" header="Valor Apropriado" body={(rowData) => currencyFormat(rowData.valorApropriado)} />
        <Column field="pessoa" header="Pessoa" />
        <Column field="contaBancaria" header="Conta Bancaria" />
        <Column field="documento" header="Documento" />
        {/* <Column field="tipoDocumento" header="Tipo de Documento" /> */}
      </Table>
    </Container>
  );
}
