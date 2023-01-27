import { Container } from './styles';

import { Header } from '../../components/Header';
import { CashFlow } from './components/CashFlow';
import { Totalizer } from './components/Totalizer';
import { useState } from 'react';
import { ChartAccounts } from './components/ChartAccounts';

export function Financial() {
  const [selectedSafra, setSelectedSafra] = useState('_');

  return (
    <Container>
      <Header
        hasSafraFilter
        selectedSafra={selectedSafra}
        setChangeSafra={setSelectedSafra}
        title='Financeiro'
      />
      <Totalizer safraId={selectedSafra} />
      <CashFlow safraId={selectedSafra} />
      <ChartAccounts safraId={selectedSafra} />
    </Container>
  );
}
