import { api } from './utils/api';
import { Almoxarifado } from '../types/Almoxarifado';

class AlmoxarifadoService {
  async findAlmoxarifados() {
    const { data } = await api.get<Almoxarifado[]>('/almoxarifados');

    return data;
  }
}

export default new AlmoxarifadoService();
