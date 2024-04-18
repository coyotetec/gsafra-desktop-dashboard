import { PermissionType } from '../types/User';
import { api } from './utils/api';

class SafraService {
  async findPermissions(userId: number) {
    const { data } = await api.get<PermissionType[]>(
      `/usuario/${userId}/permissoes`,
    );

    return data;
  }
}

export default new SafraService();
