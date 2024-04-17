import { api } from './utils/api';
import { Talhao } from '../types/Talhao';

class TalhaoService {
  async findTalhoes(idSafras: string[]) {
    const { data } = await api.get<Talhao[]>(`/talhoes/${idSafras.join(',')}`);

    return data;
  }
}

export default new TalhaoService();
