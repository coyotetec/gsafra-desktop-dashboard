import { Wrapper, StyledSelect } from './styles';

interface SelectProps {
  options: {
    label: string;
    value: string;
  }[];
  placeholder?: string;
  onChange: (_optionValue: string) => void;
  value: string;
  noOptionsMessage?: string;
  width?: string;
  label?: string;
}

export function Select({
  options,
  placeholder = 'Selecione uma opção',
  noOptionsMessage = 'Sem opções',
  onChange,
  value,
  width,
  label,
}: SelectProps) {
  return (
    <Wrapper>
      {label && <span>{label}</span>}
      <StyledSelect
        width={width}
        value={value}
        placeholder={placeholder}
        emptyMessage={noOptionsMessage}
        options={options}
        onChange={(e) => onChange(e.value)}
      />
    </Wrapper>
  );
}
