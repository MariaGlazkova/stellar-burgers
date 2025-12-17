import { FC, SyntheticEvent, useEffect } from 'react';
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
  const { values, handleChange } = useForm({
    userName: '',
    email: '',
    password: ''
  });
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
      setEmail={(value) =>
        handleChange({ target: { name: 'email', value } } as any)
      }
      setPassword={(value) =>
        handleChange({ target: { name: 'password', value } } as any)
      }
      setUserName={(value) =>
        handleChange({ target: { name: 'userName', value } } as any)
      }
      handleSubmit={handleSubmit}
    />
  );
};
