export interface TextInputProps {
  type: 'text' | 'number';
}

export const TextInput = ({ type = 'text' }: TextInputProps) => {
  return <input type={type} />;
};

export default TextInput;
