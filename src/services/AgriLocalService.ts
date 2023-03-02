import { api } from './utils/api';
import { LocalArmazenamento } from '../types/AgriLocal';

class AgriLocalService {
  findLocaisArmazenamento(): Promise<LocalArmazenamento[]> {
    return api.get('/locais-armazenamento');
  }
}

export default new AgriLocalService();
