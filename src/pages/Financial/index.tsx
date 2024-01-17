import { Container } from './styles';
import { Header } from '../../components/Header';
import { CashFlow } from './components/CashFlow';
import { Totalizer } from './components/Totalizer';
import { useCallback, useEffect, useRef } from 'react';
import { ChartAccounts } from './components/ChartAccounts';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { hasToFetch } from '../../utils/hasToFetch';
import SafraService from '../../services/SafraService';
import { setSafrasData } from '../../redux/features/safrasListSlice';
import { Select } from '../../components/Select';
import { change } from '../../redux/features/financialFiltersSlice';
import { componentsRefType } from '../../types/Types';
import { MultiSelect } from '../../components/MultiSelect';

export function Financial() {
  const {
    safrasList,
    financialFilters: { safras, lastSelectedSafras, status },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const totalizerRef = useRef<componentsRefType>({
    loadData: () => null,
  });
  const cashFlowRef = useRef<componentsRefType>({
    loadData: () => null,
  });
  const chartAccountsRef = useRef<componentsRefType>({
    loadData: () => null,
  });

  const refreshData = useCallback(() => {
    totalizerRef.current.loadData();
    cashFlowRef.current.loadData();
    chartAccountsRef.current.loadData();
  }, []);

  useEffect(() => {
    async function loadSafras() {
      if (hasToFetch(safrasList.lastFetch)) {
        const safrasData = await SafraService.findSafras();
        dispatch(
          setSafrasData(
            safrasData.map((item) => ({
              value: String(item.id),
              label: item.nome,
            })),
          ),
        );
      }
    }

    loadSafras();
  }, [dispatch, safrasList.lastFetch]);

  return (
    <Container>
      <Header
        title="Financeiro"
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
        refreshData={refreshData}
      />
      <Totalizer ref={totalizerRef} />
      <CashFlow ref={cashFlowRef} />
      <ChartAccounts ref={chartAccountsRef} />
    </Container>
  );
}
