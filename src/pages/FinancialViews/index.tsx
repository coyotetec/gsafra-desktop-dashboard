import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../components/Header';
import { Loader } from '../../components/Loader';
import { useUserContext } from '../../contexts/UserContext';
import { addViews } from '../../redux/features/financialViewsDataSlice';
import { RootState } from '../../redux/store';
import FinancialViewsService from '../../services/FinancialViewsService';
import { hasToFetch } from '../../utils/hasToFetch';
import { FinancialView } from './components/FinancialView';
import { Container } from './styles';

export function FinancialViews() {
  const [isLoading, setIsLoading] = useState(true);
  const isFirstRender = useRef(true);

  const {
    financialViewsData: { lastFetch, views },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const { hasPermission } = useUserContext();

  const loadData = useCallback(async () => {
    if (hasPermission('indicadores_financeiros')) {
      setIsLoading(true);

      if (isFirstRender.current) {
        isFirstRender.current = false;

        if (!hasToFetch(lastFetch)) {
          setIsLoading(false);
          return;
        }
      }

      const viewsData = await FinancialViewsService.findViews();
      dispatch(addViews(viewsData));
    }

    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, hasPermission]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Container>
      <Loader isLoading={isLoading} />
      <Header
        title="Indicadores Financeiros"
        subtitle={`${views.length} ${views.length === 1 ? 'INDICADOR ENCONTRADO' : 'INDICADORES ENCONTRADOS'}`}
        refreshData={loadData}
      />

      <div className="views-grid">
        {hasPermission('indicadores_financeiros') ? (
          views.map((view) => <FinancialView key={view.id} {...view} />)
        ) : (
          <FinancialView
            id={1}
            nome="Indicador"
            situacao={1}
            periodoPadraoMeses={12}
            lastFetch={null}
            rangeDates={{
              startDate: null,
              endDate: null,
            }}
            total={[]}
            totalizers={[]}
          />
        )}
      </div>
    </Container>
  );
}
