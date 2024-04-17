import { MediaCliente, MediaMes, Romaneio, Venda } from '../types/Venda';
import { api } from './utils/api';

interface FindVendaArgs {
  safraId: number;
  deliveryStatus: string;
  startDate?: string;
  endDate?: string;
}

class VendaService {
  async findVendas({
    safraId,
    deliveryStatus,
    startDate,
    endDate,
  }: FindVendaArgs) {
    const { data } = await api.get<Venda[]>('/venda', {
      params: {
        startDate,
        endDate,
        idSafra: safraId,
        situacao: deliveryStatus,
      },
    });

    return data;
  }

  async findRomaneios({
    safraId,
    deliveryStatus,
    startDate,
    endDate,
  }: FindVendaArgs) {
    const { data } = await api.get<Romaneio[]>('/venda/romaneios', {
      params: {
        idSafra: safraId,
        situacao: deliveryStatus,
        startDate,
        endDate,
      },
    });

    return data;
  }

  async findMediaCliente({
    safraId,
    deliveryStatus,
    startDate,
    endDate,
  }: FindVendaArgs) {
    const { data } = await api.get<MediaCliente[]>('/venda/media-cliente', {
      params: {
        idSafra: safraId,
        situacao: deliveryStatus,
        startDate,
        endDate,
      },
    });

    return data;
  }

  async findMediaMes({
    safraId,
    deliveryStatus,
    startDate,
    endDate,
  }: FindVendaArgs) {
    const { data } = await api.get<MediaMes>('/venda/media-mes', {
      params: {
        idSafra: safraId,
        situacao: deliveryStatus,
        startDate,
        endDate,
      },
    });

    return data;
  }
}

export default new VendaService();
