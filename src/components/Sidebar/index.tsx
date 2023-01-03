import { ChartLineUp, SignOut } from 'phosphor-react';
import { NavLink, useSearchParams } from 'react-router-dom';

import { Container, Content } from './styled';

export function Sidebar() {
  const [, setQuery] = useSearchParams();

  function handleExit() {
    setQuery((prevValue) => {
      if (!prevValue.get('sair')) {
        prevValue.append('sair', '1');
      }

      return prevValue;
    });
  }

  return (
    <Container>
      <Content>
        <strong>
          <ChartLineUp size={24} color="#00D47E" weight="bold" />
          Dashboard
        </strong>
        <nav>
          <p>FINANCEIRO</p>
          <NavLink to="/financeiro">Principal</NavLink>
          <NavLink to="/indicadores">Indicadores</NavLink>
        </nav>
        <button type='button' onClick={handleExit}>
          Sair
          <SignOut size={20} color="#F7FBFE" weight="bold" />
        </button>
      </Content>
    </Container>
  );
}
