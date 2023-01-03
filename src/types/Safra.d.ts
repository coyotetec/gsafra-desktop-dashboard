export interface Safra {
  id: number;
  nome: string;
  idCultura: number;
  dataIncio?: Date;
  dataFinal?: Date;
  status: number;
  producaoEstimada?: number;
  producaoMinima: number;
  valorMedioVenda: number;
}
