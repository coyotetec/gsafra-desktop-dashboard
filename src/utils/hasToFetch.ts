import { differenceInMinutes } from 'date-fns';

export function hasToFetch(lastFetch: Date | null) {
  if (!lastFetch) {
    return true;
  }

  return differenceInMinutes(new Date(), lastFetch) >= 10;
}
