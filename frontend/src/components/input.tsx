interface Props {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ id, label, type = 'text', autoComplete, placeholder = '', onChange }: Props) {
  return (
    <label htmlFor={id}>
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        type={type}
        id={id}
        name={id}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="mt-0.5 w-full rounded border-gray-300 p-2 shadow-sm sm:text-sm"
        onChange={onChange}
      />
    </label>
  );
}
