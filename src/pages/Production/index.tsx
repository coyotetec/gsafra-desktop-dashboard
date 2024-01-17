import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../components/Header';
import { Select } from '../../components/Select';
import { useUserContext } from '../../contexts/UserContext';
import { setData } from '../../redux/features/productionDataSlice';
import {
  change,
  setFirstSafra,
} from '../../redux/features/productionFiltersSlice';
import { setSafrasData } from '../../redux/features/safrasListSlice';
import { RootState } from '../../redux/store';
import ColheitaService from '../../services/ColheitaService';
import SafraService from '../../services/SafraService';
import { componentsRefType } from '../../types/Types';
import { hasToFetch } from '../../utils/hasToFetch';
import { Discount } from './Components/Discount';
import { Harvest } from './Components/Harvest';
import { Productivity } from './Components/Productivity';
import { Container } from './styles';

export function Production() {
  const [isHarvestLoading, setIsHarvestLoading] = useState(true);
  const isFirstRender = useRef(true);
  const discountRef = useRef<componentsRefType>({
    loadData: () => null,
  });

  const {
    productionFilters: { safra },
    productionData: { harvest },
    safrasList,
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const { hasPermission } = useUserContext();

  const loadData = useCallback(async () => {
    if (hasPermission('producao_produtividade')) {
      setIsHarvestLoading(true);

      if (isFirstRender.current) {
        isFirstRender.current = false;

        if (!hasToFetch(harvest.lastFetch)) {
          setIsHarvestLoading(false);
          return;
        }
      }

      if (safra === '_') {
        setIsHarvestLoading(false);
        return;
      }

      const harvestTotalData = await ColheitaService.findTotal(safra);

      dispatch(
        setData({
          name: 'harvest',
          data: harvestTotalData,
        }),
      );
    }

    setIsHarvestLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, hasPermission, safra]);

  const refreshData = useCallback(() => {
    loadData();
    discountRef.current.loadData();
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
        title="Produção"
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
        refreshData={refreshData}
      />
      <Harvest isLoading={isHarvestLoading} />
      <Productivity isLoading={isHarvestLoading} />
      <Discount ref={discountRef} />
    </Container>
  );
}
