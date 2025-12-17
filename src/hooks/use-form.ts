import { useState, ChangeEvent } from 'react';

type TValues = Record<string, string>;

export const useForm = <T extends TValues>(inputValues: T) => {
  const [values, setValues] = useState<T>(inputValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return { values, handleChange, setValues };
};
