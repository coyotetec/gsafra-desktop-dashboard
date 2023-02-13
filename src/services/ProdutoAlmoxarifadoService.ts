import { api } from './utils/api';
import { Combustivel } from '../types/ProdutoAlmoxarifado';

class ProdutoAlmoxarifadoService {
  findCombustiveis(): Promise<Combustivel[]> {
    return api.get('/combustiveis');
  }
}

export default new ProdutoAlmoxarifadoService();
