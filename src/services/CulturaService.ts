import { api } from './utils/api';
import { Cultura } from '../types/Cultura';

class CulturaService {
  async findCulturas() {
    const { data } = await api.get<Cultura[]>('/culturas');

    return data;
  }
}

export default new CulturaService();
