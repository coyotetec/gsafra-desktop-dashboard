import { api } from './utils/api';
import { Patrimonio } from '../types/Patrimonio';

class PatrimonioService {
  async findPatrimonios() {
    const { data } = await api.get<Patrimonio[]>('/patrimonios');

    return data;
  }
}

export default new PatrimonioService();
