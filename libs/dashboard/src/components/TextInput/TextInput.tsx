import type { FC } from 'react';

export interface TextInputProps {
  type: 'text' | 'number';
  name?: string;
  onChange?: (value: string | number) => void | unknown;
}

export const TextInput: FC<TextInputProps> = ({
  type = 'text',
  onChange,
  ...rest
}) => {
  return (
    <input
      {...rest}
      type={type}
      onChange={
        onChange
          ? (e) => {
              onChange(e.currentTarget.value);
            }
          : undefined
      }
    />
  );
};
