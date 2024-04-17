import { api } from './utils/api';
import { Combustivel } from '../types/ProdutoAlmoxarifado';

class ProdutoAlmoxarifadoService {
  async findCombustiveis() {
    const { data } = await api.get<Combustivel[]>('/combustiveis');

    return data;
  }
}

export default new ProdutoAlmoxarifadoService();
