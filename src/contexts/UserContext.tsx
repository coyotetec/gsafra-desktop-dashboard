import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFirstRender } from '../hooks/useFirstRender';
import UserService from '../services/UserService';
import { PermissionType } from '../types/User';
import { api } from '../services/utils/api';

interface UserContextProviderProps {
  children: React.ReactNode;
}

type PropsUserContext = {
  hasPermission: (permission: PermissionType) => boolean;
};

const DEFAULT_VALUE: PropsUserContext = {
  hasPermission() {
    return false;
  },
};
const UserContext = createContext<PropsUserContext>(DEFAULT_VALUE);

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [permissions, setPermissions] = useState<PermissionType[]>([]);
  const isFirstRender = useFirstRender();

  const [query] = useSearchParams();
  const idEmpresa = query.get('idEmpresa');
  const idUsuario = query.get('idUsuario');
  const databaseName = query.get('dbNome');

  useEffect(() => {
    async function loadData() {
      if (isFirstRender && idUsuario) {
        if (import.meta.env.VITE_ENVIRONMENT === 'cloud' && idEmpresa) {
          api.defaults.headers.common['X-Id-Empresa'] = idEmpresa;
        }

        api.defaults.headers.common['X-Database-Name'] =
          databaseName || 'default';

        const permissionsData = await UserService.findPermissions(
          Number(idUsuario),
        );
        setPermissions([...permissionsData]);
      }
    }

    loadData();
  }, [idUsuario, isFirstRender, databaseName, idEmpresa]);

  const hasPermission = useCallback(
    (permissionCode: PermissionType) => {
      return permissions.includes(permissionCode);
    },
    [permissions],
  );

  return (
    <UserContext.Provider value={{ hasPermission }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
