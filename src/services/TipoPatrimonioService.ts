import { api } from './utils/api';
import { TipoPatrimonio } from '../types/TipoPatrimonio';

class TipoPatrimonioService {
  async findTiposPatrimonio() {
    const { data } = await api.get<TipoPatrimonio[]>('/tipos-patrimonio');

    return data;
  }
}

export default new TipoPatrimonioService();
