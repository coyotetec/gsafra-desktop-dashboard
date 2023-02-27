import { api } from './utils/api';
import { Contrato, Romaneio } from '../types/Contrato';

interface FindRomaneiosArgs {
  contratoId: number;
  startDate?: string;
  endDate?: string;
}

class ContratoService {
  findContratos(safraId: number): Promise<Contrato[]> {
    return api.get(`/contrato?idSafra=${safraId}`);
  }
  findRomaneios({ contratoId, startDate, endDate }: FindRomaneiosArgs): Promise<Romaneio[]> {
    return api.get(`/contrato/${contratoId}/romaneios?startDate=${startDate}&endDate=${endDate}`);
  }
}

export default new ContratoService();
