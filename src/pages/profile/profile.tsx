import { ProfileUI } from '@ui-pages';
import {
  FC,
  SyntheticEvent,
  useEffect,
  useState,
  useRef,
  KeyboardEvent,
  ClipboardEvent
} from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectUser, selectUserLoading } from '@selectors';
import { fetchUser, updateUser } from '../../services/slices/user-slice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectUserLoading);
  const updateUserError = useSelector((state) => state.user.error);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    email: false,
    password: false
  });
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const passwordInteractedRef = useRef(false);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const initialFormValueRef = useRef(formValue);
  useEffect(() => {
    if (user && !isFormInitialized) {
      const normalizedUser = {
        name: user.name || '',
        email: user.email || '',
        password: ''
      };
      setFormValue(normalizedUser);
      initialFormValueRef.current = normalizedUser;
      setTouchedFields({ name: false, email: false, password: false });
      passwordInteractedRef.current = false;
      setIsFormInitialized(true);
    }
  }, [user, isFormInitialized]);

  const prevUserRef = useRef<typeof user>(null);
  const formValueRef = useRef(formValue);

  useEffect(() => {
    formValueRef.current = formValue;
  }, [formValue]);

  useEffect(() => {
    if (
      user &&
      isFormInitialized &&
      prevUserRef.current &&
      prevUserRef.current !== user &&
      (prevUserRef.current.name !== user.name ||
        prevUserRef.current.email !== user.email)
    ) {
      const currentFormValue = formValueRef.current;
      const formMatchesPrevUser =
        currentFormValue.name === (prevUserRef.current.name || '') &&
        currentFormValue.email === (prevUserRef.current.email || '') &&
        !currentFormValue.password;

      if (formMatchesPrevUser) {
        const normalizedUser = {
          name: user.name || '',
          email: user.email || '',
          password: ''
        };
        setFormValue(normalizedUser);
        initialFormValueRef.current = normalizedUser;
        setTouchedFields({ name: false, email: false, password: false });
        passwordInteractedRef.current = false;
      }

      initialFormValueRef.current = {
        name: user.name || '',
        email: user.email || '',
        password: formValueRef.current.password
      };
      setTouchedFields({ name: false, email: false, password: false });
      passwordInteractedRef.current = false;
    }
    prevUserRef.current = user;
  }, [user, isFormInitialized, formValue]);

  const trimmedPassword = formValue.password.trim();
  const trimmedInitialPassword = initialFormValueRef.current.password.trim();

  const isFormChanged =
    isFormInitialized &&
    (formValue.name !== initialFormValueRef.current.name ||
      formValue.email !== initialFormValueRef.current.email ||
      (touchedFields.password && trimmedPassword !== trimmedInitialPassword));

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const updateData: { name?: string; email?: string; password?: string } = {};
    if (formValue.name !== user?.name) {
      updateData.name = formValue.name;
    }
    if (formValue.email !== user?.email) {
      updateData.email = formValue.email;
    }
    if (formValue.password) {
      updateData.password = formValue.password;
    }
    if (Object.keys(updateData).length > 0) {
      dispatch(updateUser(updateData));
      initialFormValueRef.current = formValueRef.current;
      setTouchedFields({ name: false, email: false, password: false });
      passwordInteractedRef.current = false;
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    const password = formValueRef.current.password;
    const restoredForm = {
      ...initialFormValueRef.current,
      password
    };
    setFormValue(restoredForm);
    initialFormValueRef.current = restoredForm;
    setTouchedFields({ name: false, email: false, password: false });
    passwordInteractedRef.current = false;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prevState) => {
      if (name === 'password' && !passwordInteractedRef.current) {
        return prevState;
      }
      if (prevState[name as keyof typeof prevState] === value) {
        return prevState;
      }
      return {
        ...prevState,
        [name]: value
      };
    });
    setTouchedFields((prev) => {
      if (name === 'password' && !passwordInteractedRef.current) {
        return prev;
      }
      return {
        ...prev,
        [name]: true
      };
    });
  };

  const handlePasswordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const keysThatModifyValue =
      e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete';
    if (keysThatModifyValue) {
      passwordInteractedRef.current = true;
    }
  };

  const handlePasswordPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    passwordInteractedRef.current = true;
  };

  if (isLoading && !user) {
    return null;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError || undefined}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      handlePasswordKeyDown={handlePasswordKeyDown}
      handlePasswordPaste={handlePasswordPaste}
    />
  );
};
