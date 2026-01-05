import { Dispatch, FC, SetStateAction, SyntheticEvent, useEffect } from 'react';
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
  const { values, setFieldValue } = useForm({ email: '', password: '' });
  const error = useSelector(selectUserError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  const makeSetter =
    (field: 'email' | 'password'): Dispatch<SetStateAction<string>> =>
    (action) => {
      const nextValue =
        typeof action === 'function' ? action(values[field]) : action;
      setFieldValue(field, nextValue);
    };

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
      setEmail={makeSetter('email')}
      password={values.password}
      setPassword={makeSetter('password')}
      handleSubmit={handleSubmit}
    />
  );
};
