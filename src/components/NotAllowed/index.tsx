import { LockKey } from 'phosphor-react';
import { Container } from './styles';

export function NotAllowed() {
  return (
    <Container>
      <LockKey size={32} color="#CFD4D6" weight="fill" />
      <strong>Sem permissão</strong>
    </Container>
  );
}
