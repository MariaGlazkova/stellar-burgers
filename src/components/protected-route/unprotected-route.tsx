import { FC, ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { selectIsAuthenticated, selectUserLoading } from '@selectors';
import { fetchUser } from '../../services/slices/user-slice';
import { getCookie } from '../../utils/cookie';
import { Preloader } from '@ui';

interface UnprotectedRouteProps {
  children: ReactNode;
}

export const UnprotectedRoute: FC<UnprotectedRouteProps> = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isUserLoading = useSelector(selectUserLoading);
  const accessToken = getCookie('accessToken');
  const location = useLocation();

  useEffect(() => {
    // Avoid duplicate/concurrent user fetches
    if (accessToken && !isAuthenticated && !isUserLoading) {
      dispatch(fetchUser());
    }
  }, [dispatch, accessToken, isAuthenticated, isUserLoading]);

  // Show loader only while we're trying to restore auth from an existing token
  if (isUserLoading && accessToken && !isAuthenticated) {
    return <Preloader />;
  }

  if (isAuthenticated) {
    return <Navigate to='/' replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
