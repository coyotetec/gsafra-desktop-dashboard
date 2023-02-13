import { api } from './utils/api';
import { Talhao } from '../types/Talhao';

class TalhaoService {
  findTalhoes(idSafras: string): Promise<Talhao[]> {
    return api.get(`/talhoes/${idSafras}`);
  }
}

export default new TalhaoService();
