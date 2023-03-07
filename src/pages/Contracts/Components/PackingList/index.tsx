import { format } from 'date-fns';
import { Column } from 'primereact/column';
import { DataTablePFSEvent } from 'primereact/datatable';
import { PaginatorTemplate } from 'primereact/paginator';
import { useEffect, useState } from 'react';
import { DateInput } from '../../../../components/DateInput';
import { NotAllowed } from '../../../../components/NotAllowed';
import { Select } from '../../../../components/Select';
import { Spinner } from '../../../../components/Spinner';
import { useUserContext } from '../../../../contexts/UserContext';
import ContratoService from '../../../../services/ContratoService';
import { Romaneio } from '../../../../types/Contrato';
import { toast } from '../../../../utils/toast';
import { Container, Loader, Table } from './styles';

type optionType = {
  value: string;
  label: string;
}[]

interface PackingListProps {
  contracts: optionType;
}

interface RangeDates {
  startDate: Date | null;
  endDate: Date | null;
}

export function PackingList({ contracts }: PackingListProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState(contracts[0].value);
  const [packingList, setPackingList] = useState<Romaneio[]>([]);
  const [rangeDates, setRangeDates] = useState<RangeDates>({
    startDate: null,
    endDate: null,
  });
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const { hasPermission } = useUserContext();

  useEffect(() => {
    if (contracts.length > 0) {
      setSelectedContract(contracts[0].value);
    }
  }, [contracts]);

  useEffect(() => {
    async function loadData() {
      if (hasPermission('contratos_romaneios')) {
        setIsLoading(true);

        if (rangeDates.endDate && rangeDates.startDate && rangeDates.endDate < rangeDates.startDate) {
          setIsLoading(false);
          toast({
            type: 'danger',
            text: 'Data final precisa ser maior que inicial!'
          });
          return;
        }

        const startDateParsed = rangeDates.startDate ? format(rangeDates.startDate, 'dd-MM-yyyy') : '';
        const endDateParsed = rangeDates.endDate ? format(rangeDates.endDate, 'dd-MM-yyyy') : '';

        const packingListData = await ContratoService.findRomaneios({
          contratoId: Number(selectedContract),
          startDate: startDateParsed,
          endDate: endDateParsed,
        });

        setPackingList(packingListData);
      }
      setIsLoading(false);
    }

    loadData();
  }, [selectedContract, rangeDates, hasPermission]);

  function formatNumber(number: number, sufix?: string) {
    return `${new Intl.NumberFormat('id').format(number)}${sufix ? sufix : ''}`;
  }

  function handlePage(event: DataTablePFSEvent) {
    setFirst(event.first);
    setRows(event.rows);
  }

  const paginatorTemplate: PaginatorTemplate = {
    layout: 'CurrentPageReport PrevPageLink NextPageLink',
    'CurrentPageReport': (options) => {
      return (
        <span style={{ userSelect: 'none' }}>
          {options.first} - {options.last} de {options.totalRecords} Romaneios
        </span>
      );
    },
  };

  return (
    <Container>
      <header>
        <h3>ROMANEIOS</h3>
        <div className="filters">
          <Select
            options={contracts}
            onChange={setSelectedContract}
            value={selectedContract}
            width="320px"
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
              width="160px"
              fontSize="16px"
              horizontalPadding="12px"
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
              width="160px"
              fontSize="16px"
              horizontalPadding="12px"
            />
          </div>
        </div>
      </header>
      <div className="table-wrapper">
        {!hasPermission('contratos_romaneios') && <NotAllowed />}
        {isLoading && (
          <Loader>
            <Spinner size={48} />
          </Loader>
        )}
        <Table
          value={packingList}
          responsiveLayout="scroll"
          emptyMessage="Nenhum romaneio encontrado"
          paginator
          paginatorTemplate={paginatorTemplate}
          first={first}
          rows={rows}
          onPage={handlePage}
          paginatorClassName="justify-content-end"
        >
          <Column field="data" header="Data" body={(rowData) => format(new Date(rowData.data), 'dd/MM/yyyy')} />
          <Column field="numeroOrdem" header="Romaneio" />
          <Column field="quantidade" header="Quantidade" body={(rowData) => formatNumber(rowData.quantidade, ' Kg')} />
          <Column field="localSaida" header="Local de Saída" />
          <Column field="motorista" header="Motorista" />
          <Column field="placa" header="Placa" />
        </Table>
      </div>
    </Container>
  );
}
