export interface Total {
  quantity: number;
  total: number;
  totalNextSeven: {
    quantity: number,
    total: number,
  },
  totalNextFifteen: {
    quantity: number,
    total: number
  }
}

export interface CashFlowPattern {
  month: string;
  value: number;
}

export interface CashFlow {
  currentBalance: number;
  cashFlowBalance: CashFlowPattern[];
  cashFlowBalancePlan: CashFlowPattern[];
  cashFlowCredits: CashFlowPattern[];
  cashFlowCreditsPlan: CashFlowPattern[];
  cashFlowDebits: CashFlowPattern[];
  cashFlowDebitsPlan: CashFlowPattern[];
  hasError?: boolean;
}
