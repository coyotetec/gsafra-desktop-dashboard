import { PermissionType } from '../types/User';
import { axiosApi } from './utils/api';

class SafraService {
  async findPermissions(userId: number) {
    const { data } = await axiosApi.get<PermissionType[]>(
      `/usuario/${userId}/permissoes`,
    );

    return data;
  }
}

export default new SafraService();
