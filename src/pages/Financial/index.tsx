import { Container } from './styles';

import { Header } from '../../components/Header';
import { CashFlow } from './components/CashFlow';
import { Totalizer } from './components/Totalizer';
import { useState } from 'react';
import { ChartAccounts } from './components/ChartAccounts';
import { Loader } from '../../components/Loader';

export function Financial() {
  const [selectedSafra, setSelectedSafra] = useState('_');
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Container>
      <Loader isLoading={isLoading} />
      <Header selectedSafra={selectedSafra} setChangeSafra={setSelectedSafra} title='Financeiro' />
      <Totalizer safraId={selectedSafra} setIsLoading={setIsLoading} />
      <CashFlow safraId={selectedSafra} setIsLoading={setIsLoading} />
      <ChartAccounts safraId={selectedSafra} setIsLoading={setIsLoading} />
    </Container>
  );
}
