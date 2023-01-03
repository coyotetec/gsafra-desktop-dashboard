import HttpClient from './utils/HttpClient';

class SafraService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient('http://localhost:3001');
  }

  findPermissions(userId: number): Promise<PermissionType[]> {
    return this.httpClient.get(`/usuario/${userId}/permissoes`);
  }
}

export default new SafraService();
