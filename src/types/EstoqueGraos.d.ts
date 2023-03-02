export interface EstoqueGraosTotal {
  saldoAnterior: number;
  entradas: {
    peso: number;
    descontoClassificacao: number;
    taxaRecepcao: number;
    cotaCapital: number;
    taxaArmazenamento: number;
    quebraTecnica: number;
    pesoLiquido: number;
  };
  saidas: {
    peso: number;
    descontoClassificacao: number;
    pesoLiquido: number;
  };
  saldoFinal: number;
}

export interface EstoqueGraosProdutor {
  idProdutor: number;
  produtor: string;
  saldoAnterior: number;
  entradas: {
    peso: number;
    descontoClassificacao: number;
    taxaRecepcao: number;
    cotaCapital: number;
    taxaArmazenamento: number;
    quebraTecnica: number;
    pesoLiquido: number;
  };
  saidas: {
    peso: number;
    descontoClassificacao: number;
    pesoLiquido: number;
  };
  saldoFinal: number;
}

export interface EstoqueGraosProdutorTotal {
  estoqueGraosProdutor: EstoqueGraosProdutor[];
  saldoFinal: {
    idProdutor: number;
    produtor: string;
    saldo: number;
    saldoSacas: number;
  }[];
}
