import { MediaCliente, MediaMes, Romaneio, Venda } from '../types/Venda';
import { api } from './utils/api';

interface FindVendaArgs {
  safraId: number;
  deliveryStatus: string;
  startDate?: string;
  endDate?: string;
}

class VendaService {
  findVendas({ safraId, deliveryStatus, startDate, endDate }: FindVendaArgs): Promise<Venda[]> {
    return api.get(`/venda?idSafra=${safraId}&situacao=${deliveryStatus}&startDate=${startDate}&endDate=${endDate}`);
  }

  findRomaneios({ safraId, deliveryStatus, startDate, endDate }: FindVendaArgs): Promise<Romaneio[]> {
    return api.get(`/venda/romaneios?idSafra=${safraId}&situacao=${deliveryStatus}&startDate=${startDate}&endDate=${endDate}`);
  }

  findMediaCliente({ safraId, deliveryStatus, startDate, endDate }: FindVendaArgs): Promise<MediaCliente[]> {
    return api.get(`/venda/media-cliente?idSafra=${safraId}&situacao=${deliveryStatus}&startDate=${startDate}&endDate=${endDate}`);
  }

  findMediaMes({ safraId, deliveryStatus, startDate, endDate }: FindVendaArgs): Promise<MediaMes> {
    return api.get(`/venda/media-mes?idSafra=${safraId}&situacao=${deliveryStatus}&startDate=${startDate}&endDate=${endDate}`);
  }
}

export default new VendaService();
