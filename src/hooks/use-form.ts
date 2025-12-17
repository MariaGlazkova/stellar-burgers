import { useState, ChangeEvent } from 'react';

type TValues = Record<string, string>;

export const useForm = <T extends TValues>(inputValues: T) => {
  const [values, setValues] = useState<T>(inputValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const setFieldValue = (name: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }) as T);
  };

  return { values, handleChange, setFieldValue, setValues };
};
