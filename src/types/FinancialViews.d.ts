export interface View {
  id: number;
  nome: string;
  situacao: number;
}

export interface ViewTotal {
  id: number;
  nome: string;
  total: number;
  totalReal: number;
}

export interface ViewTotalizer {
  nome: string;
  total?: string;
  error?: string;
}

export interface ViewDetail {
  nome: string;
  data: Date;
  valor: number;
  tipoLancamento?: string;
  descricao: string;
  contaBancaria: string;
  pessoa: string;
  documento?: string;
  tipoDocumento?: string;
}
