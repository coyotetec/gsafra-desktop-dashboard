import { api } from './utils/api';
import { TipoPatrimonio } from '../types/TipoPatrimonio';

class TipoPatrimonioService {
  findTiposPatrimonio(): Promise<TipoPatrimonio[]> {
    return api.get('/tipos-patrimonio');
  }
}

export default new TipoPatrimonioService();
