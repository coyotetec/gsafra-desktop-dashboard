export interface CustoCategoria {
  totalCusto: number;
  totalCustoPorHectare: number;
  totalCustoCategoria: {
    total: number;
    categoria: string;
    totalPorHectare: number;
    porcentagem: number;
  }[];
}

export interface CustoIndividual {
  inputsTotalSafra: number;
  inputsTotalPorHectareSafra: number;
  inputsTotal: {
    insumo: string;
    total: number;
    quantidade: number;
    unidade: string;
    porcentagem: number;
    totalPorHectare: number;
    quantidadePorHectare: number;
  }[];
}

export interface CustoTalhao {
  totalCusto: number;
  totalCustoPorHectare: number;
  totalCustoTalhao: {
    total: number;
    totalPorHectare: number;
    talhao: string;
    variedade: string;
    talhaoVariedade: string;
    area: number;
    porcentagem: number;
    safra: string;
  }[];
}
