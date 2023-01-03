export interface MovimentoContas {
  data: Date
  valorTotal: number
  valorApropriado: number
  contaBancaria: string
  pessoa: string
  documento?: string
  descricao: string
  planoConta: string
  tipoDocumento: string
}
