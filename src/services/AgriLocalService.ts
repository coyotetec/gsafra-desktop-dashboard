import { api } from './utils/api';
import { LocalArmazenamento } from '../types/AgriLocal';

class AgriLocalService {
  async findLocaisArmazenamento() {
    const { data } = await api.get<LocalArmazenamento[]>(
      '/locais-armazenamento',
    );

    return data;
  }
}

export default new AgriLocalService();
