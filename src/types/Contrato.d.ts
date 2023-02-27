export interface Contrato {
  id: number;
  cliente: string;
  numeroContrato: string;
  totalContrato: number;
  totalEntregue: number;
  porcentagem: number;
}

export interface Romaneio {
  data: Date;
  numeroOrdem: number;
  quantidade: number;
  localSaida: string;
  motorista: string;
  placa: string;
}
