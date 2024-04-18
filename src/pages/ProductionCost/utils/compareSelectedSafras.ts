import { optionType } from '../../../redux/features/productionCostFiltersSlice';

export function compareSelectedSafras(ids: string[], safras: optionType) {
  if (ids.length !== safras.length) {
    return false;
  }

  const sortedIds = [...ids].sort();
  const sortedSafrasValues = safras.map(({ value }) => value).sort();

  for (let i = 0; i < sortedIds.length; i++) {
    if (sortedIds[i] !== sortedSafrasValues[i]) {
      return false;
    }
  }

  return true;
}
