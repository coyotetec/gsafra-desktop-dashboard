import { api } from './utils/api';

class SafraService {
  findPermissions(userId: number, databaseName?: string): Promise<PermissionType[]> {
    api.setDefaultHeaders({
      'X-Database-Name': databaseName ? databaseName : 'default'
    });

    return api.get(`/usuario/${userId}/permissoes`);
  }
}

export default new SafraService();
