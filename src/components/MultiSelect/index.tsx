import { Wrapper, StyledMultiSelect } from './styles';

interface MultiSelectProps {
  options: {
    label: string;
    value: string;
  }[];
  placeholder?: string;
  onChange: (_optionsValue: string[]) => void;
  value: string[];
  selectedItemsLabel?: string;
  onClose?: (_optionsValue: string[]) => void;
  width?: string;
  height?: string;
  label?: string;
}

export function MultiSelect({
  options,
  onChange,
  value,
  placeholder = 'Selecione uma opção',
  selectedItemsLabel = '{0} itens selecionados',
  onClose,
  width,
  height,
  label,
}: MultiSelectProps) {
  return (
    <Wrapper>
      {label && <span>{label}</span>}
      <StyledMultiSelect
        width={width}
        height={height}
        value={value}
        placeholder={placeholder}
        options={options}
        onChange={(e) => onChange(e.value)}
        onHide={() => {
          if (onClose) {
            onClose(value);
          }
        }}
        maxSelectedLabels={1}
        selectedItemsLabel={selectedItemsLabel}
      />
    </Wrapper>
  );
}
