interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 block text-sm text-gray-700 sm:text-base">
          {label}
        </label>
      )}
      <input
        {...props}
        className="sm:text-base w-full rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all duration-200 ease-in-out focus:border-transparent focus:ring-2 focus:ring-neutral-500"
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
