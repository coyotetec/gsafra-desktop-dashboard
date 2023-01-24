export interface MonthlyReviewPattern {
  month: string;
  value: number;
}

export interface MonthlyReviewData {
  monthlyValue: MonthlyReviewPattern[];
  monthlyValueTotal: number;
  monthlyQty: MonthlyReviewPattern[];
  monthlyQtyTotal: number;
}

export interface PatrimonyReviewPattern {
  tipoPatrimonio: string;
  total: number;
}

export interface PatrimonyReviewData {
  patrimonyValue: PatrimonyReviewPattern[];
  patrimonyValueTotal: number;
  patrimonyQty: PatrimonyReviewPattern[];
  patrimonyQtyTotal: number;
}

export interface FuelReviewPattern {
  combustivel: string;
  total: number;
}

export interface FuelReviewData {
  fuelValue: FuelReviewPattern[];
  fuelValueTotal: number;
  fuelQty: FuelReviewPattern[];
  fuelQtyTotal: number;
}

export interface DetailsData {
  mes: string;
  data: Date;
  numeroRequisicao?: string;
  patrimonio: string;
  tipoPatrimonio: string;
  combustivel: string;
  localSaida: string;
  quantidade: number;
  custoIndividual: number;
  total: number;
}
