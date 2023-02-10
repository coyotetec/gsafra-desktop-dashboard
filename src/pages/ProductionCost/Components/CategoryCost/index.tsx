import { useContext, useEffect, useState } from 'react';
import { Spinner } from '../../../../components/Spinner';
import { Container, Loader } from './styles';
import CustoProducaoService from '../../../../services/CustoProducaoService';
import { toast } from '../../../../utils/toast';
import { format } from 'date-fns';
import { CustoCategoria } from '../../../../types/CustoProducao';
import { currencyFormat } from '../../../../utils/currencyFormat';
import { CategoryCostChart } from '../CategoryCostChart';
import { NotAllowed } from '../../../../components/NotAllowed';
import { UserContext } from '../../../../components/App';

interface CategoryCostProps {
  safraIds: string[];
  talhaoId: string | null;
  unit: string;
  rangeDates: {
    startDate: Date | null;
    endDate: Date | null;
  };
}

export function CategoryCost({ safraIds, talhaoId, rangeDates, unit }: CategoryCostProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [categoryCost, setCategoryCost] = useState<CustoCategoria>({
    totalCusto: 0,
    totalCustoPorHectare: 0,
    totalCustoCategoria: []
  });

  const { hasPermission } = useContext(UserContext);

  useEffect(() => {
    async function loadData() {
      if (hasPermission('custo_producao_categoria')) {
        setIsLoading(true);

        if (safraIds.length === 0) {
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

        const categoryCostData = await CustoProducaoService.findCustoCategoria({
          safraId: safraIds.join(','),
          talhaoId: talhaoId ? Number(talhaoId) : undefined,
          startDate: startDateParsed,
          endDate: endDateParsed,
        });

        setCategoryCost(categoryCostData);
      }
      setIsLoading(false);
    }

    loadData();
  }, [safraIds, talhaoId, rangeDates, hasPermission]);

  return (
    <Container>
      <header>
        <h3>CUSTOS POR CATEGORIA</h3>
      </header>
      <div className="card">
        {!hasPermission('custo_producao_categoria') && <NotAllowed />}
        {isLoading && (
          <Loader>
            <Spinner size={48} />
          </Loader>
        )}
        <header>
          <div className="total">
            <span>
              <strong>{unit === 'hectareCost' ? 'Custo Total/ha: ' : 'Custo Total: '}</strong>
              {unit === 'hectareCost' && currencyFormat(categoryCost.totalCustoPorHectare)}
              {unit === 'cost' && currencyFormat(categoryCost.totalCusto)}
              {unit === 'percent' && currencyFormat(categoryCost.totalCusto)}
            </span>
          </div>
        </header>
        <CategoryCostChart
          labels={categoryCost.totalCustoCategoria.map((i) => i.categoria)}
          data={categoryCost.totalCustoCategoria.map((i) => unit === 'hectareCost' ? i.totalPorHectare : i.total)}
          percentages={categoryCost.totalCustoCategoria.map((i) => i.porcentagem)}
          unit={unit}
        />
      </div>
    </Container>
  );
}
