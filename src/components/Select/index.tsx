import { StyledSelect } from './styles';

interface SelectProps {
  options: {
    label: string;
    value: string;
  }[];
  placeholder?: string;
  onChange: (_optionValue: string) => void;
  value: string;
  noOptionsMessage?: string;
}

export function Select({
  options,
  placeholder = 'Selecione uma opção',
  noOptionsMessage = 'Sem opções',
  onChange,
  value,
}: SelectProps) {
  return (
    <StyledSelect
      value={value}
      placeholder={placeholder}
      emptyMessage={noOptionsMessage}
      options={options}
      onChange={(e) => onChange(e.value)}
    />
  );
}
