import { PermissionType } from '../types/User';
import { api } from './utils/api';

class SafraService {
  findPermissions(
    userId: number,
    empresaId?: string,
    databaseName?: string,
  ): Promise<PermissionType[]> {
    if (import.meta.env.VITE_ENVIRONMENT === 'cloud' && empresaId) {
      api.setDefaultHeaders({
        'X-Id-Empresa': empresaId,
      });
    }

    api.setDefaultHeaders({
      'X-Database-Name': databaseName || 'default',
    });

    return api.get(`/usuario/${userId}/permissoes`);
  }
}

export default new SafraService();
