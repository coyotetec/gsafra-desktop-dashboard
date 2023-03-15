import { format } from 'date-fns';
import { Column } from 'primereact/column';
import { DataTablePFSEvent } from 'primereact/datatable';
import { PaginatorTemplate } from 'primereact/paginator';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { componentsRefType } from '../../../../types/Types';
import { DateInput } from '../../../../components/DateInput';
import { NotAllowed } from '../../../../components/NotAllowed';
import { Select } from '../../../../components/Select';
import { Spinner } from '../../../../components/Spinner';
import { useUserContext } from '../../../../contexts/UserContext';
import { setPackingList } from '../../../../redux/features/contractDataSlice';
import { change, setFirstContract } from '../../../../redux/features/contractFiltersSlice';
import { RootState } from '../../../../redux/store';
import ContratoService from '../../../../services/ContratoService';
import { hasToFetch } from '../../../../utils/hasToFetch';
import { toast } from '../../../../utils/toast';
import { Container, Loader, Table } from './styles';

export const PackingList = forwardRef<componentsRefType>((props, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const isFirstRender = useRef(true);

  const { hasPermission } = useUserContext();

  const {
    contractFilters: {
      selectedContract,
      packingListRangeDates: rangeDates
    },
    contractData: {
      contractOptions,
      packingList,
      packingListLastFetch,
    }
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const loadData = useCallback(async () => {
    if (hasPermission('contratos_romaneios')) {
      setIsLoading(true);

      if (isFirstRender.current) {
        isFirstRender.current = false;

        if (!hasToFetch(packingListLastFetch)) {
          setIsLoading(false);
          return;
        }
      }

      if (selectedContract === '_') {
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

      const startDateParsed = rangeDates.startDate ? format(rangeDates.startDate, 'dd-MM-yyyy') : '';
      const endDateParsed = rangeDates.endDate ? format(rangeDates.endDate, 'dd-MM-yyyy') : '';

      const packingListData = await ContratoService.findRomaneios({
        contratoId: Number(selectedContract),
        startDate: startDateParsed,
        endDate: endDateParsed,
      });

      dispatch(setPackingList(packingListData));
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, hasPermission, rangeDates.endDate, rangeDates.startDate, selectedContract]);

  useImperativeHandle(ref, () => ({
    loadData
  }), [loadData]);

  useEffect(() => {
    if (contractOptions.length > 0) {
      dispatch(setFirstContract(contractOptions[0]?.value || '_'));
    }
  }, [dispatch, contractOptions]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
            options={contractOptions}
            onChange={(value: string) => dispatch(change({
              name: 'selectedContract',
              value
            }))}
            value={selectedContract}
            width="320px"
          />
          <div className="date-filter">
            <DateInput
              onChangeDate={(date) => {
                dispatch(change({
                  name: 'packingListRangeDates',
                  value: {
                    startDate: date,
                    endDate: rangeDates.endDate
                  }
                }));
              }}
              placeholder='Data Inicial'
              defaultDate={rangeDates.startDate}
              height="48px"
              width="160px"
              fontSize="16px"
              horizontalPadding="12px"
            />
            <strong>à</strong>
            <DateInput
              onChangeDate={(date) => {
                dispatch(change({
                  name: 'packingListRangeDates',
                  value: {
                    startDate: rangeDates.startDate,
                    endDate: date
                  }
                }));
              }}
              placeholder='Data Final'
              defaultDate={rangeDates.endDate}
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
});
