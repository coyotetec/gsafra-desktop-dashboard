import { api } from './utils/api';
import { Cultura } from '../types/Cultura';

class CulturaService {
  findCulturas(): Promise<Cultura[]> {
    return api.get('/culturas');
  }
}

export default new CulturaService();
