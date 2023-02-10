export interface ColheitaTotalTalhao {
  total: number;
  sacas: number;
  totalPorHectare: number;
  sacasPorHectare: number;
  talhao: string;
  tamanhoTalhao: number;
}

export interface ColheitaTotal {
  totalSafra: number;
  sacasSafra: number;
  totalPorHectareSafra: number;
  sacasPorHectareSafra: number;
  talhoesTotal: ColheitaTotalTalhao[];
}

export interface ColheitaDescontoTotal {
  pesoTotalSafra: number;
  totalDescontoSafra: number;
  porcentagemDescontoSafra: number;
  totalDescontoRealSafra: number;
  talhoesDescontoTotal: {
    pesoTotal: number;
    descontoTotal: number;
    descontoPorcentagem: number;
    descontoReal: number;
    talhao: string;
  }[];
}
