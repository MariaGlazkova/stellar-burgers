import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectUser, selectIsAuthenticated } from '@selectors';
import { getCookie } from '../../utils/cookie';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleProfileClick = () => {
    const accessToken = getCookie('accessToken');
    if (!accessToken || !isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/profile');
    }
  };

  const handleConstructorClick = () => {
    navigate('/');
  };

  const handleFeedClick = () => {
    navigate('/feed');
  };

  return (
    <AppHeaderUI
      userName={user?.name}
      onProfileClick={handleProfileClick}
      onConstructorClick={handleConstructorClick}
      onFeedClick={handleFeedClick}
      pathname={location.pathname}
    />
  );
};
