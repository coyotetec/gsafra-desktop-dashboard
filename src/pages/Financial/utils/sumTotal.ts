import { Total } from '../../../types/Financial';

export function sumTotal(total: Total[]) {
  return total.reduce((acc, curr) => (
    {
      quantity: acc.quantity + curr.quantity,
      total: acc.total + curr.total,
      totalNextSeven: {
        quantity: acc.totalNextSeven.quantity + curr.totalNextSeven.quantity,
        total: acc.totalNextSeven.total + curr.totalNextSeven.total
      },
      totalNextFifteen: {
        quantity: acc.totalNextFifteen.quantity + curr.totalNextFifteen.quantity,
        total: acc.totalNextFifteen.total + curr.totalNextFifteen.total
      }
    }
  ), {
    quantity: 0,
    total: 0,
    totalNextSeven: {
      quantity: 0,
      total: 0,
    },
    totalNextFifteen: {
      quantity: 0,
      total: 0,
    }
  });
}
