import { Dispatch, FC, SetStateAction, SyntheticEvent, useEffect } from 'react';
import { useNavigate, useLocation, Location } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { registerUser } from '../../services/slices/user-slice';
import {
  selectUserError,
  selectUserLoading,
  selectIsAuthenticated
} from '@selectors';
import { RegisterUI } from '@ui-pages';
import { useForm } from '../../hooks/use-form';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { values, setFieldValue } = useForm({
    userName: '',
    email: '',
    password: ''
  });
  const error = useSelector(selectUserError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  const makeSetter =
    (
      field: 'email' | 'password' | 'userName'
    ): Dispatch<SetStateAction<string>> =>
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
    dispatch(
      registerUser({
        name: values.userName,
        email: values.email,
        password: values.password
      })
    );
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={values.email}
      userName={values.userName}
      password={values.password}
      setEmail={makeSetter('email')}
      setPassword={makeSetter('password')}
      setUserName={makeSetter('userName')}
      handleSubmit={handleSubmit}
    />
  );
};
