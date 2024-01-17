import { Check } from 'phosphor-react';
import { StyledCheckbox, Wrapper } from './styles';

interface CheckboxProps {
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

export function Checkbox({ name, label, checked, onChange }: CheckboxProps) {
  return (
    <Wrapper>
      <StyledCheckbox id={name} checked={checked} onChange={onChange} />
      {checked && (
        <Check onClick={onChange} color="#FFFFFF" size={18} weight="bold" />
      )}
      <label htmlFor={name}>{label}</label>
    </Wrapper>
  );
}
