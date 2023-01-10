import { format, parse } from 'date-fns';
import { useIMask, IMask } from 'react-imask';
import { Wrapper } from './styles';

interface DateInputProps {
  label?: string;
  placeholder?: string;
  defaultDate?: Date | null;
  onChangeDate?: (_params: Date | null) => void;
}

export function DateInput({
  label,
  placeholder,
  defaultDate,
  onChangeDate
}: DateInputProps) {
  const { ref, typedValue, unmaskedValue } = useIMask({
    mask: Date,
    pattern: 'dd/MM/yyyy',
    blocks: {
      dd: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 31
      },
      MM: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 12
      },
      yyyy: {
        mask: IMask.MaskedRange,
        from: 2000,
        to: 9999
      }
    },
    parse: (str) => parse(str, 'dd/MM/yyyy', new Date),
    format: (date) => format(date, 'dd/MM/yyyy'),
  });

  function handleInputChange() {
    if (onChangeDate) {
      if (typedValue) {
        onChangeDate(typedValue);
      }

      if (unmaskedValue === '') {
        onChangeDate(null);
      }
    }
  }

  return (
    <Wrapper>
      {label && <label>{label}</label>}

      <input
        ref={ref}
        onChange={handleInputChange}
        placeholder={placeholder}
        defaultValue={defaultDate ? format(defaultDate, 'dd/MM/yyyy') : ''}
      />
    </Wrapper>
  );
}
