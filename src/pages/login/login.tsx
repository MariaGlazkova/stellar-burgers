import { FC, SyntheticEvent, useEffect } from 'react';
import { useNavigate, useLocation, Location } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/slices/user-slice';
import {
  selectUserError,
  selectUserLoading,
  selectIsAuthenticated
} from '@selectors';
import { LoginUI } from '@ui-pages';
import { useForm } from '../../hooks/use-form';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { values, handleChange } = useForm({ email: '', password: '' });
  const error = useSelector(selectUserError);
  const isLoading = useSelector(selectUserLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email: values.email, password: values.password }));
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={values.email}
      setEmail={(value) =>
        handleChange({ target: { name: 'email', value } } as any)
      }
      password={values.password}
      setPassword={(value) =>
        handleChange({ target: { name: 'password', value } } as any)
      }
      handleSubmit={handleSubmit}
    />
  );
};
