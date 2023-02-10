import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../components/App';
import { Header } from '../../components/Header';
import ColheitaService from '../../services/ColheitaService';
import { ColheitaTotal } from '../../types/Colheita';
import { Discount } from './Components/Discount';
import { Harvest } from './Components/Harvest';
import { Productivity } from './Components/Productivity';
import { Container } from './styles';

export function Production() {
  const [selectedSafra, setSelectedSafra] = useState('_');
  const [isHarvestLoading, setIsHarvestLoading] = useState(true);
  const [harvestTotal, setHarvestTotal] = useState<ColheitaTotal>({
    totalSafra: 0,
    sacasSafra: 0,
    totalPorHectareSafra: 0,
    sacasPorHectareSafra: 0,
    talhoesTotal: []
  });

  const { hasPermission } = useContext(UserContext);

  useEffect(() => {
    async function loadData() {
      if (hasPermission('producao_produtividade')) {
        setIsHarvestLoading(true);

        if (selectedSafra === '_') {
          setIsHarvestLoading(false);
          return;
        }

        const harvestTotalData = await ColheitaService.findTotal(selectedSafra);

        setHarvestTotal(harvestTotalData);
      }

      setIsHarvestLoading(false);
    }

    loadData();
  }, [selectedSafra, hasPermission]);

  return (
    <Container>
      <Header
        title="Produção"
        hasSafraFilter
        selectedSafra={selectedSafra}
        setChangeSafra={setSelectedSafra}
        allSafras={false}
      />
      <Harvest
        isLoading={isHarvestLoading}
        totalSafra={harvestTotal.totalSafra}
        totalSacasSafra={harvestTotal.sacasSafra}
        talhoesTotal={harvestTotal.talhoesTotal}
      />
      <Productivity
        isLoading={isHarvestLoading}
        totalSafra={harvestTotal.totalPorHectareSafra}
        totalSacasSafra={harvestTotal.sacasPorHectareSafra}
        talhoesTotal={harvestTotal.talhoesTotal}
      />
      <Discount safraId={selectedSafra} />
    </Container>
  );
}
