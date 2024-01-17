import { Spinner } from '../../../../components/Spinner';
import { Container, Loader } from './styles';
import { HarvestChart } from '../HarvestChart';
import { Switch } from '../../../../components/Switch';
import { NotAllowed } from '../../../../components/NotAllowed';
import { useUserContext } from '../../../../contexts/UserContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { change } from '../../../../redux/features/productionFiltersSlice';

interface HarvestProps {
  isLoading: boolean;
}

export function Harvest({ isLoading }: HarvestProps) {
  const {
    productionFilters: { productionUnit: unit },
    productionData: {
      harvest: { totalSafra, sacasSafra, talhoesTotal },
    },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const { hasPermission } = useUserContext();

  function formatNumber(number: number, sufix?: string) {
    return `${new Intl.NumberFormat('id').format(number)}${sufix || ''}`;
  }

  return (
    <Container>
      <h3>PRODUÇÃO</h3>
      <div className="card">
        {!hasPermission('producao_produtividade') && <NotAllowed />}
        {isLoading && (
          <Loader>
            <Spinner size={48} />
          </Loader>
        )}
        <header>
          <div className="total">
            <span>
              <strong>Total em Kg: </strong>
              {formatNumber(totalSafra, ' Kg')}
            </span>
            <span>
              <strong>Total em Sacas: </strong>
              {formatNumber(sacasSafra, ' Sacas')}
            </span>
          </div>
          <Switch
            leftLabel="Sacas"
            rightLabel="Kg"
            isToggled={unit === 'kg'}
            onToggle={(e) =>
              dispatch(
                change({
                  name: 'productionUnit',
                  value: e.target.checked ? 'kg' : 'sacks',
                }),
              )
            }
          />
        </header>
        <HarvestChart
          labels={talhoesTotal.map((i) => i.talhao)}
          data={talhoesTotal.map((i) => (unit === 'sacks' ? i.sacas : i.total))}
          unit={unit}
        />
      </div>
    </Container>
  );
}
