import { useContext, useState } from 'react';
import { Spinner } from '../../../../components/Spinner';
import { Container, Loader } from './styles';
import { ColheitaTotalTalhao } from '../../../../types/Colheita';
import { HarvestChart } from '../HarvestChart';
import { Switch } from '../../../../components/Switch';
import { UserContext } from '../../../../components/App';
import { NotAllowed } from '../../../../components/NotAllowed';

interface HarvestProps {
  isLoading: boolean;
  totalSafra: number;
  totalSacasSafra: number;
  talhoesTotal: ColheitaTotalTalhao[];
}

export function Harvest({ isLoading, totalSafra, totalSacasSafra, talhoesTotal }: HarvestProps) {
  const [unit, setUnit] = useState<'kg' | 'sacks'>('sacks');

  const { hasPermission } = useContext(UserContext);

  function formatNumber(number: number, sufix?: string) {
    return `${new Intl.NumberFormat('id').format(number)}${sufix ? sufix : ''}`;
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
        <HarvestChart
          labels={talhoesTotal.map(i => i.talhao)}
          data={talhoesTotal.map(i => unit === 'sacks' ? i.sacas : i.total)}
          unit={unit}
        />
      </div>
    </Container>
  );
}
