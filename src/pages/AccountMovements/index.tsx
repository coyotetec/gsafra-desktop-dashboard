/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataTableExpandedRows } from 'primereact/datatable';

import { Header } from '../../components/Header';
import { Loader } from '../../components/Loader';
import MovimentoContaService from '../../services/MovimentoContaService';
import { MovimentoContas } from '../../types/MovimentoContas';
import { Container, Table } from './styles';
import { Column } from 'primereact/column';
import { format } from 'date-fns';
import { currencyFormat } from '../../utils/currencyFormat';
import { DateInput } from '../../components/DateInput';
import { ChartAccountsSelect } from '../../components/ChartAccoutsSelect';
import { FileXls } from 'phosphor-react';
import { WorkBook } from 'xlsx';
import { toast } from '../../utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { change } from '../../redux/features/financialFiltersSlice';
import { Select } from '../../components/Select';
import { MultiSelect } from '../../components/MultiSelect';

export function AccountMovements() {
  const [isLoading, setIsLoading] = useState(true);
  const [accountMovements, setAccountMovements] = useState<MovimentoContas[]>(
    [],
  );
  const [expandedRows, setExpandedRows] = useState<
    any[] | DataTableExpandedRows
  >([]);

  const [query] = useSearchParams();
  const type = query.get('type') as 'credit' | 'debit';

  const {
    financialFilters: {
      chartAccountsCreditRangeDates: {
        startDate: creditStartDate,
        endDate: creditEndDate,
      },
      chartAccountsDebitRangeDates: {
        startDate: debitStartDate,
        endDate: debitEndDate,
      },
      chartAccountsCreditSelected: selectedCredit,
      chartAccountsDebitSelected: selectedDebit,
      safras,
      lastSelectedSafras,
      status,
    },
    safrasList,
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const rangeDates = useMemo(
    () =>
      type === 'credit'
        ? {
            startDate: creditStartDate,
            endDate: creditEndDate,
          }
        : {
            startDate: debitStartDate,
            endDate: debitEndDate,
          },
    [creditEndDate, creditStartDate, debitEndDate, debitStartDate, type],
  );
  const selectedChartAccount = useMemo(
    () => (type === 'credit' ? selectedCredit : selectedDebit),
    [selectedCredit, selectedDebit, type],
  );

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

      const accountMovementsData =
        await MovimentoContaService.findMovimentoContas(
          String(selectedChartAccount),
          startDateParsed,
          endDateParsed,
          lastSelectedSafras.length > 0
            ? lastSelectedSafras.join(',')
            : undefined,
        );
      setAccountMovements(accountMovementsData);
      setIsLoading(false);
    }

    loadData();
  }, [selectedChartAccount, rangeDates, lastSelectedSafras]);

  function handleExportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(
        accountMovements.map((i) => ({
          'PLANO DE CONTA': i.planoConta,
          DATA: format(new Date(i.data), 'dd/MM/yyyy'),
          'VALOR TOTAL': i.valorTotal,
          'VALOR APROPRIADO': i.valorApropriado,
          DESCRICAO: i.descricao,
          'CONTA BANCÁRIA': i.contaBancaria,
          PESSOA: i.pessoa,
          DOCUMENTO: i.documento,
          'TIPO DE DOCUMENTO': i.tipoDocumento,
        })),
      );

      for (let i = 2; i <= accountMovements.length + 1; i++) {
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
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      saveAsExcelFile(
        excelBuffer,
        `MOVIMENTOS DE CONTA ${
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
      <Header
        title={`${type === 'credit' ? 'Créditos' : 'Debitos'} Compensados`}
        subtitle="VISÃO ANALÍTICA"
        canGoBack
        headerFilter={
          <>
            <MultiSelect
              options={safrasList.options}
              onChange={(value) => {
                dispatch(change({ name: 'safras', value }));
              }}
              value={safras}
              placeholder="Todas as Safras"
              selectedItemsLabel="{0} Safras"
              onClose={(value) => {
                if (
                  JSON.stringify(lastSelectedSafras) === JSON.stringify(value)
                ) {
                  return;
                }

                dispatch(change({ name: 'lastSelectedSafras', value }));
              }}
              width="324px"
            />
            <Select
              options={[
                {
                  value: '_',
                  label: 'Todos os Lançamentos',
                },
                {
                  value: 'real',
                  label: 'Lançamentos Reais',
                },
                {
                  value: 'provisional',
                  label: 'Lançamentos Provisórios',
                },
              ]}
              value={status}
              onChange={(value: string) => {
                dispatch(change({ name: 'status', value }));
              }}
              width="280px"
            />
          </>
        }
      />
      <div className="filters">
        <ChartAccountsSelect type={type} />
        <div>
          <div className="date-inputs">
            <DateInput
              onChangeDate={(date) => {
                dispatch(
                  change({
                    name:
                      type === 'credit'
                        ? 'chartAccountsCreditRangeDates'
                        : 'chartAccountsDebitRangeDates',
                    value: {
                      startDate: date,
                      endDate: rangeDates.endDate,
                    },
                  }),
                );
              }}
              placeholder="Data Inicial"
              defaultDate={rangeDates.startDate}
            />
            <strong>à</strong>
            <DateInput
              onChangeDate={(date) => {
                dispatch(
                  change({
                    name:
                      type === 'credit'
                        ? 'chartAccountsCreditRangeDates'
                        : 'chartAccountsDebitRangeDates',
                    value: {
                      startDate: rangeDates.startDate,
                      endDate: date,
                    },
                  }),
                );
              }}
              placeholder="Data Final"
              defaultDate={rangeDates.endDate}
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
        rowGroupHeaderTemplate={(data) => <strong>{data.planoConta}</strong>}
        emptyMessage="Nenhum dado encontrado"
      >
        <Column
          field="data"
          header="Data"
          body={(rowData) => format(new Date(rowData.data), 'dd/MM/yyyy')}
        />
        <Column field="descricao" header="Descricao" />
        <Column
          field="valorTotal"
          header="Valor Total"
          body={(rowData) => currencyFormat(rowData.valorTotal)}
        />
        <Column
          field="valorApropriado"
          header="Valor Apropriado"
          body={(rowData) => currencyFormat(rowData.valorApropriado)}
        />
        <Column field="pessoa" header="Pessoa" />
        <Column field="contaBancaria" header="Conta Bancaria" />
        <Column field="documento" header="Documento" />
        {/* <Column field="tipoDocumento" header="Tipo de Documento" /> */}
      </Table>
    </Container>
  );
}
