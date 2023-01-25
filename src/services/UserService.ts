import HttpClient from './utils/HttpClient';
import { PORT } from './utils/info';

class SafraService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(`http://localhost:${PORT}`);
  }

  findPermissions(userId: number, databaseName?: string): Promise<PermissionType[]> {
    return this.httpClient.get(`/usuario/${userId}/permissoes`, {
      headers: {
        ...(databaseName && {'X-Database-Name': databaseName})
      }
    });
  }
}

export default new SafraService();
