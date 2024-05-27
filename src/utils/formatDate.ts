import { format, parseISO } from 'date-fns';

export function formatDate(date: Date) {
  return format(parseISO(String(date)), 'dd/MM/yyyy');
}
