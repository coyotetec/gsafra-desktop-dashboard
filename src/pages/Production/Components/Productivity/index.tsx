import { useContext, useState } from 'react';
import { Spinner } from '../../../../components/Spinner';
import { Container, Loader } from './styles';
import { ColheitaTotalTalhao } from '../../../../types/Colheita';
import { ProductivityChart } from '../ProductivityChart';
import { Switch } from '../../../../components/Switch';
import { NotAllowed } from '../../../../components/NotAllowed';
import { UserContext } from '../../../../components/App';

interface ProductivityProps {
  isLoading: boolean;
  totalSafra: number;
  totalSacasSafra: number;
  talhoesTotal: ColheitaTotalTalhao[];
}

export function Productivity({ isLoading, totalSafra, totalSacasSafra, talhoesTotal }: ProductivityProps) {
  const [unit, setUnit] = useState<'kg' | 'sacks'>('sacks');

  const { hasPermission } = useContext(UserContext);

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
              {formatNumber(totalSafra, ' Kg')}
            </span>
            <span>
              <strong>Média de Sacas/ha: </strong>
              {formatNumber(totalSacasSafra, ' Sacas')}
            </span>
          </div>
          <Switch
            leftLabel="Sacas"
            rightLabel="Kg"
            isToggled={unit === 'kg'}
            onToggle={(e) => {setUnit(e.target.checked ? 'kg' : 'sacks');}}
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
