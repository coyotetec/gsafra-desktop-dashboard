import HttpClient from './utils/HttpClient';
import { PORT } from './utils/info';

class SafraService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(`http://localhost:${PORT}`);
  }

  findPermissions(userId: number): Promise<PermissionType[]> {
    return this.httpClient.get(`/usuario/${userId}/permissoes`);
  }
}

export default new SafraService();
