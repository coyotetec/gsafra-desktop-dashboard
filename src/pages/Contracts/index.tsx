import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../components/Header';
import { Select } from '../../components/Select';
import { useUserContext } from '../../contexts/UserContext';
import { setContracts } from '../../redux/features/contractDataSlice';
import {
  change,
  setFirstSafra,
} from '../../redux/features/contractFiltersSlice';
import { setSafrasData } from '../../redux/features/safrasListSlice';
import { RootState } from '../../redux/store';
import ContratoService from '../../services/ContratoService';
import SafraService from '../../services/SafraService';
import { componentsRefType } from '../../types/Types';
import { hasToFetch } from '../../utils/hasToFetch';
import { PackingList } from './Components/PackingList';
import { Totalizers } from './Components/Totalizers';
import { Container } from './styles';

export function Contracts() {
  const [isLoading, setIsLoading] = useState(true);
  const isFirstRender = useRef(true);
  const packingListRef = useRef<componentsRefType>({
    loadData: () => null,
  });

  const { hasPermission } = useUserContext();

  const {
    contractFilters: { safra },
    contractData: { contractOptions, contractsLastFetch },
    safrasList,
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const loadData = useCallback(async () => {
    if (hasPermission('contratos')) {
      setIsLoading(true);

      if (isFirstRender.current) {
        isFirstRender.current = false;

        if (!hasToFetch(contractsLastFetch)) {
          setIsLoading(false);
          return;
        }
      }

      if (safra === '_') {
        setIsLoading(false);
        return;
      }

      const contractsData = await ContratoService.findContratos(Number(safra));

      dispatch(setContracts(contractsData));
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, hasPermission, safra]);

  const refreshData = useCallback(() => {
    loadData();
    packingListRef.current.loadData();
  }, [loadData]);

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

      dispatch(setFirstSafra(safrasList.options[0]?.value || '_'));
    }

    loadSafras();
  }, [dispatch, safrasList.lastFetch, safrasList.options]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Container>
      <Header
        title="Contratos"
        refreshData={refreshData}
        headerFilter={
          <Select
            options={safrasList.options}
            placeholder="Safra"
            noOptionsMessage="0 safras encontradas"
            value={safra}
            onChange={(value: string) => {
              dispatch(change({ name: 'safra', value }));
            }}
            width="324px"
          />
        }
      />
      <Totalizers isLoading={isLoading} />
      {contractOptions.length > 0 && <PackingList ref={packingListRef} />}
    </Container>
  );
}
