import { eachMonthOfInterval, format } from 'date-fns';
import ptBRLocale from 'date-fns/locale/pt-BR';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox } from '../../components/Checkbox';
import { DateInput } from '../../components/DateInput';
import { Header } from '../../components/Header';
import { NotAllowed } from '../../components/NotAllowed';
import { Spinner } from '../../components/Spinner';
import { useUserContext } from '../../contexts/UserContext';
import { setData } from '../../redux/features/accountsDataSlice';
import { change } from '../../redux/features/accountsFiltersSlice';
import { RootState } from '../../redux/store';
import PlanoContaService from '../../services/PlanoContaService';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { currencyFormat } from '../../utils/currencyFormat';
import { hasToFetch } from '../../utils/hasToFetch';
import { toast } from '../../utils/toast';
import { Container, Table, Loader } from './styles';
import { parseChartAccounts } from './utils/parseChartAccounts';

export function ChartAccountsFinancial() {
  const [isLoading, setIsLoading] = useState(true);
  const isFirstRender = useRef(true);

  const { hasPermission } = useUserContext();

  const {
    accountsFilters: {
      options,
      showZeros,
      startDate,
      endDate
    },
    accountsData: {
      accountsNodes,
      accountsTotal,
      eachMonthTotal,
      months,
      lastFetch,
    }
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  function handleToggleSelectedOptions(option: string) {
    const newState = [...options];
    const optionIndex = newState.indexOf(option);

    if (optionIndex === -1) {
      newState.push(option);

      return dispatch(change({
        name: 'options',
        value: newState
      }));
    }

    if (newState.length === 1) {
      toast({
        type: 'danger',
        text: 'É obrigatório pelo menos uma opção marcada'
      });

      return dispatch(change({
        name: 'options',
        value: newState
      }));
    }

    dispatch(change({
      name: 'options',
      value: newState.filter((item) => item !== option)
    }));
  }

  useEffect(() => {
    async function loadData() {
      if (hasPermission('contas_receber_pagar')) {
        setIsLoading(true);
        if (isFirstRender.current) {
          isFirstRender.current = false;

          if (!hasToFetch(lastFetch)) {
            setIsLoading(false);
            return;
          }
        }

        if (!startDate || !endDate) {
          setIsLoading(false);
          toast({
            type: 'danger',
            text: 'Data incial e final são obrigatórias'
          });
          return;
        }

        if (endDate < startDate) {
          setIsLoading(false);
          toast({
            type: 'danger',
            text: 'Data final precisa ser maior que inicial!'
          });
          return;
        }

        const parsedStartDate = format(startDate, 'dd-MM-yyyy');
        const parsedEndDate = format(endDate, 'dd-MM-yyyy');

        const { data, total, eachMonthTotal } = await PlanoContaService.findPlanoContasFinancial(
          options.join(','),
          showZeros,
          parsedStartDate,
          parsedEndDate
        );
        const monthsNames = eachMonthOfInterval({
          start: startDate,
          end: endDate,
        }).map((date) =>
          capitalizeFirstLetter(
            format(date, 'MMM. \'de\' yy', {
              locale: ptBRLocale,
            })
          )
        );
        const parsedData = parseChartAccounts(data, monthsNames);

        dispatch(setData({
          months: monthsNames,
          accounts: parsedData,
          eachMonthTotal,
          total,
        }));
      }
      setIsLoading(false);
    }

    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, options, showZeros, startDate, endDate]);

  return (
    <Container>
      <Header title="Contas Receber x Pagar" />
      <div className="filters">
        <Checkbox
          name="payments"
          label="Contas a Pagar"
          checked={options.includes('payments')}
          onChange={() => handleToggleSelectedOptions('payments')}
        />
        <Checkbox
          name="receivables"
          label="Contas a Receber"
          checked={options.includes('receivables')}
          onChange={() => handleToggleSelectedOptions('receivables')}
        />
        <Checkbox
          name="checks"
          label="Cheques"
          checked={options.includes('checks')}
          onChange={() => handleToggleSelectedOptions('checks')}
        />
        <Checkbox
          name="creditCard"
          label="Cartão de Crédito"
          checked={options.includes('creditCard')}
          onChange={() => handleToggleSelectedOptions('creditCard')}
        />
        <Checkbox
          name="zeros"
          label="Mostrar Contas Zeradas"
          checked={showZeros}
          onChange={() => dispatch(change({
            name: 'showZeros',
            value: !showZeros
          }))}
        />
      </div>
      <header>
        <h3>PLANO DE CONTAS</h3>
        <div className="date-filter">
          <DateInput
            onChangeDate={(date) => {
              dispatch(change({
                name: 'startDate',
                value: date
              }));
            }}
            placeholder='Data Inicial'
            defaultDate={startDate}
          />
          <strong>à</strong>
          <DateInput
            onChangeDate={(date) => {
              dispatch(change({
                name: 'endDate',
                value: date
              }));
            }}
            placeholder='Data Final'
            defaultDate={endDate}
          />
        </div>
      </header>
      <div className="table-wrapper">
        {!hasPermission('contas_receber_pagar') && <NotAllowed />}
        {isLoading && (
          <Loader>
            <Spinner size={48} />
          </Loader>
        )}
        <Table
          value={accountsNodes}
          emptyMessage="Nenhuma conta encontrada"
          scrollable
          scrollHeight="460px"
          style={{ width: '100%' }}
          footerColumnGroup={(
            <ColumnGroup>
              <Row>
                <Column style={{ width: '340px' }} />
                {months.map((month, index) => (
                  <Column
                    key={`month_${month}`}
                    footer={currencyFormat(eachMonthTotal[index])}
                    style={{ width: '148px' }}
                  />
                ))}
                <Column
                  footer={currencyFormat(accountsTotal)}
                  style={{ width: '156px' }}
                />
              </Row>
            </ColumnGroup>
          )}
        >
          <Column
            field="name"
            header="Conta"
            style={{ width: '340px' }}
            expander
          />
          {months.map((month, index) => (
            <Column
              key={`month_${month}`}
              field={`month${index}`}
              header={month}
              body={(rowData) => currencyFormat(rowData.data[`month${index}`])}
              style={{ width: '148px' }}
            />
          ))}
          <Column
            field={'total'}
            header={'Total'}
            body={(rowData) => currencyFormat(rowData.data.total || 0)}
            style={{ width: '156px' }}
          />
        </Table>
      </div>
    </Container>
  );
}
