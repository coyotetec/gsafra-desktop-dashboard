import { useContext, useEffect, useState } from 'react';
import { Spinner } from '../../../../components/Spinner';
import { Container, Loader } from './styles';
import { ActivityChart } from '../ActivityChart';
import { CustoIndividual } from '../../../../types/CustoProducao';
import CustoProducaoService from '../../../../services/CustoProducaoService';
import { format } from 'date-fns';
import { toast } from '../../../../utils/toast';
import { currencyFormat } from '../../../../utils/currencyFormat';
import { Switch } from '../../../../components/Switch';
import { UserContext } from '../../../../components/App';
import { NotAllowed } from '../../../../components/NotAllowed';

interface MaintenanceProps {
  safraIds: string[];
  talhaoId: string | null;
  unit: string;
  rangeDates: {
    startDate: Date | null;
    endDate: Date | null;
  };
}

export function Maintenance({ safraIds, talhaoId, rangeDates, unit: parentUnit }: MaintenanceProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [unit, setUnit] = useState<'parent' | 'qty'>('parent');
  const [maintenanceCost, setMaintenanceCost] = useState<CustoIndividual>({
    inputsTotalSafra: 0,
    inputsTotalPorHectareSafra: 0,
    inputsTotal: []
  });

  const { hasPermission } = useContext(UserContext);

  useEffect(() => {
    async function loadData() {
      if (hasPermission('custo_producao_insumo_manutencao')) {
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

        const maintenanceCostData = await CustoProducaoService.findCustoManutencao({
          safraId: safraIds.join(','),
          talhaoId: talhaoId ? Number(talhaoId) : undefined,
          startDate: startDateParsed,
          endDate: endDateParsed,
        });

        setMaintenanceCost(maintenanceCostData);
      }
      setIsLoading(false);
    }

    loadData();
  }, [safraIds, talhaoId, rangeDates, hasPermission]);

  return (
    <Container>
      <header>
        <h3>CUSTOS DE MANUTENÇÃO</h3>
      </header>
      <div className="card">
        {!hasPermission('custo_producao_insumo_manutencao') && <NotAllowed />}
        {isLoading && (
          <Loader>
            <Spinner size={48} />
          </Loader>
        )}
        <header>
          <div className="total">
            <span>
              <strong>{parentUnit === 'hectareCost' ? 'Custo Total/ha: ' : 'Custo Total: '}</strong>
              {parentUnit === 'hectareCost' && currencyFormat(maintenanceCost.inputsTotalPorHectareSafra)}
              {parentUnit === 'cost' && currencyFormat(maintenanceCost.inputsTotalSafra)}
              {parentUnit === 'percent' && currencyFormat(maintenanceCost.inputsTotalSafra)}
            </span>
          </div>
          <Switch
            leftLabel={parentUnit === 'cost'
              ? 'R$'
              : parentUnit === 'hectareCost'
                ? 'R$/ha'
                : '%'}
            rightLabel="Quantidade"
            isToggled={unit === 'qty'}
            onToggle={(e) => { setUnit(e.target.checked ? 'qty' : 'parent'); }}
          />
        </header>
        <ActivityChart
          labels={maintenanceCost.inputsTotal.map(i => i.insumo)}
          units={maintenanceCost.inputsTotal.map(i => i.unidade)}
          data={maintenanceCost.inputsTotal.map(i => unit === 'qty'
            ? i.quantidade
            : parentUnit === 'cost'
              ? i.total
              : parentUnit === 'hectareCost'
                ? i.totalPorHectare
                : i.porcentagem)}
          unit={unit === 'parent' ? parentUnit : unit}
        />
      </div>
    </Container>
  );
}
