import { useDispatch, useSelector } from 'react-redux';
import { change } from '../../redux/features/financialFiltersSlice';
import { RootState } from '../../redux/store';
import { StyledTreeSelect } from './styles';

interface ChartAccountsSelectProps {
  type: 'credit' | 'debit';
}

export function ChartAccountsSelect({ type }: ChartAccountsSelectProps) {
  const {
    financialFilters: {
      chartAccountsCreditSelected,
      chartAccountsDebitSelected
    },
    chartAccountsList: {
      credit: creditOptions,
      debit: debitOptions
    },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  return (
    <StyledTreeSelect
      options={type === 'credit' ? creditOptions : debitOptions}
      value={type === 'credit' ? chartAccountsCreditSelected : chartAccountsDebitSelected}
      onChange={(e) => dispatch(change({
        name: type === 'credit' ? 'chartAccountsCreditSelected' : 'chartAccountsDebitSelected',
        value: e.value
      }))}
      placeholder="Plano de Contas"
    />
  );
}
