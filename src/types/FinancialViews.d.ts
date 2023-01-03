export interface View {
  id: number;
  nome: string;
  situacao: number;
}

export interface ViewTotal {
  nome: string;
  total: number;
}

export interface ViewDetail {
  nome: string;
  data: Date;
  valor: number;
  descricao: string;
  contaBancaria: string;
  pessoa: string;
  documento?: string;
  tipoDocumento?: string;
}
