import { FC, ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { selectIsAuthenticated, selectUserLoading } from '@selectors';
import { fetchUser } from '../../services/slices/user-slice';
import { getCookie } from '../../utils/cookie';
import { Preloader } from '@ui';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isUserLoading = useSelector(selectUserLoading);
  const accessToken = getCookie('accessToken');
  const location = useLocation();

  useEffect(() => {
    // Avoid duplicate/concurrent user fetches (e.g. when page also dispatches fetchUser)
    if (accessToken && !isAuthenticated && !isUserLoading) {
      dispatch(fetchUser());
    }
  }, [dispatch, accessToken, isAuthenticated, isUserLoading]);

  // Show loader only while we're trying to restore auth from an existing token
  if (isUserLoading && accessToken && !isAuthenticated) {
    return <Preloader />;
  }

  // If we are not authenticated (even if a stale token exists) — send to login
  if (!isAuthenticated) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
