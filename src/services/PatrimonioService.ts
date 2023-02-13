import { api } from './utils/api';
import { Patrimonio } from '../types/Patrimonio';

class PatrimonioService {
  findPatrimonios(): Promise<Patrimonio[]> {
    return api.get('/patrimonios');
  }
}

export default new PatrimonioService();
