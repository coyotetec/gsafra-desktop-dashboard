import { api } from './utils/api';
import { Produtor } from '../types/Pessoa';

class PessoaService {
  findProdutores(): Promise<Produtor[]> {
    return api.get('/produtores');
  }
}

export default new PessoaService();
