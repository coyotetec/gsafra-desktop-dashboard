import { api } from './utils/api';
import { Almoxarifado } from '../types/Almoxarifado';

class AlmoxarifadoService {
  findAlmoxarifados(): Promise<Almoxarifado[]> {
    return api.get('/almoxarifados');
  }
}

export default new AlmoxarifadoService();
