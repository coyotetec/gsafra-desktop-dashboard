import { api } from './utils/api';
import { Safra } from '../types/Safra';

class SafraService {
  async findSafras() {
    const { data } = await api.get<Safra[]>('/safras');

    return data;
  }
}

export default new SafraService();
