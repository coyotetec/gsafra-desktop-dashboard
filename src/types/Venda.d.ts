export interface Venda {
  idCliente: number;
  cliente: string;
  total: number;
  totalEntregue: number;
  porcentagem: number;
}

export interface Romaneio {
  cliente: string;
  data: Date;
  numeroOrdem: number;
  quantidade: number;
  localSaida: string;
  motorista: string;
  placa: string;
}

export interface MediaCliente {
  cliente: string;
  precoMedioKg: number;
  precoMedioSaca: number;
}

export interface MediaMes {
  mediaSafraKg: number;
  mediaSafraSaca: number;
  mediaMes: {
    mes: string;
    precoMedioKg: number;
    precoMedioSaca: number;
  }[];
}
