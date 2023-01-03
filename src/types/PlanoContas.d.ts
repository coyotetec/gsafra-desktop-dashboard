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
