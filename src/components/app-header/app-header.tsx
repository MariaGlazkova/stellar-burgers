import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectUser, selectIsAuthenticated } from '@selectors';
import { getCookie } from '../../utils/cookie';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const location = useLocation();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const profilePath =
    !getCookie('accessToken') || !isAuthenticated ? '/login' : '/profile';

  return (
    <AppHeaderUI
      userName={user?.name}
      profilePath={profilePath}
      pathname={location.pathname}
    />
  );
};
