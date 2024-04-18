import { api } from './utils/api';
import { Produtor } from '../types/Pessoa';

class PessoaService {
  async findProdutores() {
    const { data } = await api.get<Produtor[]>('/produtores');

    return data;
  }
}

export default new PessoaService();
