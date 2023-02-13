import { api } from './utils/api';
import { Safra } from '../types/Safra';

class SafraService {
  findSafras(): Promise<Safra[]> {
    return api.get('/safras');
  }
}

export default new SafraService();
