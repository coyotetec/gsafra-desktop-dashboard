import { Container, Wrapper } from './styles';

interface SwitchProps {
  leftLabel?: string;
  rightLabel?: string;
  isToggled: boolean;
  onToggle: React.ChangeEventHandler<HTMLInputElement>;
}

export function Switch({ leftLabel, rightLabel, isToggled, onToggle }: SwitchProps) {
  return (
    <Wrapper>
      {leftLabel && <strong>{leftLabel}</strong>}
      <Container>
        <input type="checkbox" checked={isToggled} onChange={onToggle} />
        <span className="slider" />
      </Container>
      {rightLabel && <strong>{rightLabel}</strong>}
    </Wrapper>
  );
}
