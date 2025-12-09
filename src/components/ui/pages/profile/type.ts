import { ChangeEvent, SyntheticEvent } from 'react';

export type ProfileUIProps = {
  formValue: {
    name: string;
    email: string;
    password: string;
  };
  isFormChanged: boolean;
  handleSubmit: (e: SyntheticEvent) => void;
  handleCancel: (e: SyntheticEvent) => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handlePasswordKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handlePasswordPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  updateUserError?: string;
};
