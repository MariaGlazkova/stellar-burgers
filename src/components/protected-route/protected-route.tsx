import { FC, ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { selectIsAuthenticated } from '@selectors';
import { fetchUser } from '../../services/slices/user-slice';
import { getCookie } from '../../utils/cookie';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const accessToken = getCookie('accessToken');

  useEffect(() => {
    if (accessToken && !isAuthenticated) {
      dispatch(fetchUser());
    }
  }, [dispatch, accessToken, isAuthenticated]);

  if (!accessToken && !isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
};
