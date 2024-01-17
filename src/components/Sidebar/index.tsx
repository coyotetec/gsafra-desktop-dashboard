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
          <NavLink to="/contas-receber-pagar">Contas Receber x Pagar</NavLink>
          <p>ABASTECIMENTO</p>
          <NavLink to="/abastecimento/resumo-mensal">Mensal</NavLink>
          <NavLink to="/abastecimento/resumo-patrimonio">
            Tipo de Patrimonio
          </NavLink>
          <NavLink to="/abastecimento/resumo-combustivel">Combustível</NavLink>
          <p>AGRIGULTURA</p>
          <NavLink to="/producao">Produção</NavLink>
          <NavLink to="/custo-producao">Custo Produção</NavLink>
          <NavLink to="/contratos">Contratos</NavLink>
          <NavLink to="/vendas">Vendas</NavLink>
          <NavLink to="/estoque-graos">Estoque de Grãos</NavLink>
        </nav>
        <button type="button" onClick={handleExit}>
          Sair
          <SignOut size={20} color="#F7FBFE" weight="bold" />
        </button>
      </Content>
    </Container>
  );
}
