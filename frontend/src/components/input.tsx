interface Props {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ id, name, label, type = 'text', autoComplete, placeholder = '', onChange }: Props) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none sm:text-sm"
        onChange={onChange}
      />
    </div>
  );
}
