export interface PlanoContas {
  id: number;
  idPai: number;
  codigo: string;
  descricao: string;
  descricaoImpressao: string;
  tipo: string;
  nivel: number;
  categoria: number;
  status: number;
  dedutivel: number;
  idPlanoContaTipoGrupo?: number;
}

export interface PlanoContasTotal {
  descricao: string;
  total: number;
}

export interface PlanoContasFinancial {
  codigo: string;
  descricao: string;
  month0: number;
  month1: number;
  month2: number;
  month3: number;
  month4: number;
  month5: number;
}
