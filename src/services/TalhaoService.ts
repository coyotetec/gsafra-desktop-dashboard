import { axiosApi } from './utils/api';
import { Talhao } from '../types/Talhao';

class TalhaoService {
  async findTalhoes(idSafras: string[]) {
    const { data } = await axiosApi.get<Talhao[]>(
      `/talhoes/${idSafras.join(',')}`,
    );

    return data;
  }
}

export default new TalhaoService();
