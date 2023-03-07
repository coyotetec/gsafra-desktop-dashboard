import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { useUserContext } from '../../contexts/UserContext';
import ContratoService from '../../services/ContratoService';
import { Contrato } from '../../types/Contrato';
import { PackingList } from './Components/PackingList';
import { Totalizers } from './Components/Totalizers';
import { Container } from './styles';

type optionType = {
  value: string;
  label: string;
}[]

export function Contracts() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSafra, setSelectedSafra] = useState('_');
  const [contracts, setContracts] = useState<Contrato[]>([]);
  const [contractOptions, setContractOptions] = useState<optionType>([]);

  const { hasPermission } = useUserContext();

  useEffect(() => {
    async function loadData() {
      if (hasPermission('contratos')) {
        setIsLoading(true);

        if (selectedSafra === '_') {
          setIsLoading(false);
          return;
        }

        const contractsData = await ContratoService.findContratos(Number(selectedSafra));

        setContracts(contractsData);
        setContractOptions(contractsData.reduce((result, item) => {
          if (item.totalEntregue > 0) {
            result.push({
              value: String(item.id),
              label: `${item.cliente} - ${item.numeroContrato}`
            });
          }

          return result;
        }, [] as optionType));
      }
      setIsLoading(false);
    }

    loadData();
  }, [selectedSafra, hasPermission]);

  return (
    <Container>
      <Header
        title="Contratos"
        hasSafraFilter
        setChangeSafra={setSelectedSafra}
        selectedSafra={selectedSafra}
        allSafras={false}
      />
      <Totalizers
        contracts={contracts}
        isLoading={isLoading}
      />
      {contractOptions.length > 0 && (
        <PackingList
          contracts={contractOptions}
        />
      )}
    </Container>
  );
}
