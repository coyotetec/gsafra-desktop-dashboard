import { useContext, useEffect, useState } from 'react';
import { Spinner } from '../../../../components/Spinner';
import ColheitaService, { descontoType } from '../../../../services/ColheitaService';
import { Container, Loader } from './styles';
import { ColheitaDescontoTotal } from '../../../../types/Colheita';
import { Switch } from '../../../../components/Switch';
import { Select } from '../../../../components/Select';
import { DiscountChart } from '../DiscountChart';
import { UserContext } from '../../../../components/App';
import { NotAllowed } from '../../../../components/NotAllowed';

interface DiscountProps {
  safraId: string;
}

type optionType = {
  value: descontoType;
  label: string;
}[]

export function Discount({ safraId }: DiscountProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [unit, setUnit] = useState<'kg' | 'percent'>('percent');
  const [selectedDiscount, setSelectedDiscount] = useState('umidade');
  const [discountTotal, setDiscountTotal] = useState<ColheitaDescontoTotal>({
    pesoTotalSafra: 0,
    porcentagemDescontoSafra: 0,
    totalDescontoRealSafra: 0,
    totalDescontoSafra: 0,
    talhoesDescontoTotal: [],
  });
  const discountOptions: optionType = [
    { value: 'umidade', label: 'Umidade' },
    { value: 'impureza', label: 'Impureza' },
    { value: 'avariados', label: 'Avariados' },
    { value: 'quebrados', label: 'Quebrados' },
    { value: 'esverdeados', label: 'Esverdeados' },
    { value: 'taxa_recepcao', label: 'Taxa de Recepção' },
    { value: 'cota', label: 'Cota' },
  ];

  const { hasPermission } = useContext(UserContext);

  useEffect(() => {
    async function loadData() {
      if (hasPermission('descontos_producao')) {
        setIsLoading(true);

        if (safraId === '_') {
          setIsLoading(false);
          return;
        }

        const discountTotalData = await ColheitaService
          .findDescontoTotal(safraId, selectedDiscount as descontoType);

        setDiscountTotal(discountTotalData);
      }
      setIsLoading(false);
    }

    loadData();
  }, [safraId, selectedDiscount, hasPermission]);

  function formatNumber(number: number, sufix?: string) {
    return `${new Intl.NumberFormat('id').format(number)}${sufix ? sufix : ''}`;
  }

  return (
    <Container>
      <header>
        <h3>DESCONTOS</h3>
        <Select
          options={discountOptions}
          value={selectedDiscount}
          onChange={setSelectedDiscount}
          width="240px"
          height="40px"
        />
      </header>
      <div className="card">
        {!hasPermission('descontos_producao') && <NotAllowed />}
        {isLoading && (
          <Loader>
            <Spinner size={48} />
          </Loader>
        )}
        <header>
          <div className="total">
            <span>
              <strong>Desconto Total em Kg: </strong>
              {formatNumber(discountTotal.totalDescontoRealSafra, ' Kg')}
            </span>
            <span>
              <strong>Média {discountOptions.find((i) => i.value === selectedDiscount)?.label}: </strong>
              {formatNumber(discountTotal.porcentagemDescontoSafra, '%')}
            </span>
          </div>
          <Switch
            leftLabel="%"
            rightLabel="Kg"
            isToggled={unit === 'kg'}
            onToggle={(e) => { setUnit(e.target.checked ? 'kg' : 'percent'); }}
          />
        </header>
        <DiscountChart
          labels={discountTotal.talhoesDescontoTotal.map(i => i.talhao)}
          data={discountTotal.talhoesDescontoTotal.map(i => unit === 'percent' ? i.descontoPorcentagem : i.descontoReal)}
          unit={unit}
        />
      </div>
    </Container>
  );
}
