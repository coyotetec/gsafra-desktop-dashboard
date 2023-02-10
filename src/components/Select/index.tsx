import { Leaf } from 'phosphor-react';
import { Wrapper, StyledSelect, OptionGroup } from './styles';

type optionsType = {
  value: string;
  label: string;
}[];

type groupedOptionsType = {
  label: string;
  items: {
    label: string;
    value: string;
  }[]
}[];

interface SelectProps {
  options: optionsType;
  placeholder?: string;
  onChange: (_optionValue: string) => void;
  value: string;
  noOptionsMessage?: string;
  width?: string;
  height?: string;
  labelMargin?: string;
  label?: string;
  isGrouped?: boolean;
}

interface SelectGroupProps {
  options: groupedOptionsType;
  placeholder?: string;
  onChange: (_optionValue: string | null) => void;
  value: string | null;
  noOptionsMessage?: string;
  width?: string;
  height?: string;
  labelMargin?: string;
  label?: string;
  isGrouped?: boolean;
}

export function Select({
  options,
  placeholder = 'Selecione uma opção',
  noOptionsMessage = 'Sem opções',
  onChange,
  value,
  width,
  height,
  labelMargin,
  label,
  isGrouped = false
}: SelectProps | SelectGroupProps) {
  return (
    <Wrapper>
      {label && <span>{label}</span>}
      <StyledSelect
        width={width}
        height={height}
        labelMargin={labelMargin}
        value={value}
        placeholder={placeholder}
        emptyMessage={noOptionsMessage}
        options={options}
        onChange={(e) => onChange(e.value)}
        optionLabel="label"
        optionGroupLabel={isGrouped ? 'label' : undefined}
        optionGroupChildren={isGrouped ? 'items' : undefined}
        optionGroupTemplate={isGrouped ? (option) => (
          <OptionGroup>
            <Leaf size={20} color="#00D47E" weight='bold' />
            <span>
              {option.label}
            </span>
          </OptionGroup>
        ) : undefined}
        showClear={isGrouped}
      />
    </Wrapper>
  );
}
