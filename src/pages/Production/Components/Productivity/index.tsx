import { Spinner } from '../../../../components/Spinner';
import { Container, Loader } from './styles';
import { ProductivityChart } from '../ProductivityChart';
import { Switch } from '../../../../components/Switch';
import { NotAllowed } from '../../../../components/NotAllowed';
import { useUserContext } from '../../../../contexts/UserContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { change } from '../../../../redux/features/productionFiltersSlice';

interface ProductivityProps {
  isLoading: boolean;
}

export function Productivity({ isLoading }: ProductivityProps) {
  const {
    productionFilters: { productivityUnit: unit },
    productionData: {
      harvest: {
        totalPorHectareSafra,
        sacasPorHectareSafra,
        talhoesTotal
      }
    }
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const { hasPermission } = useUserContext();

  function formatNumber(number: number, sufix?: string) {
    return `${new Intl.NumberFormat('id').format(number)}${sufix ? sufix : ''}`;
  }

  return (
    <Container>
      <h3>PRODUTIVIDADE</h3>
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
              <strong>Média de Kg/ha: </strong>
              {formatNumber(totalPorHectareSafra, ' Kg')}
            </span>
            <span>
              <strong>Média de Sacas/ha: </strong>
              {formatNumber(sacasPorHectareSafra, ' Sacas')}
            </span>
          </div>
          <Switch
            leftLabel="Sacas"
            rightLabel="Kg"
            isToggled={unit === 'kg'}
            onToggle={(e) => dispatch(change({
              name: 'productivityUnit',
              value: e.target.checked ? 'kg' : 'sacks'
            }))}
          />
        </header>
        <ProductivityChart
          labels={talhoesTotal.map(i => i.talhao)}
          data={talhoesTotal.map(i => unit === 'sacks' ? i.sacasPorHectare : i.totalPorHectare)}
          unit={unit}
        />
      </div>
    </Container>
  );
}
