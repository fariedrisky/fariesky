interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({ label, error, ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 block text-sm text-gray-700 sm:text-base">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className="min-h-[100px] w-full text-sm sm:text-base resize-y rounded-xl border border-gray-200 px-4 py-2 text-gray-700 placeholder-gray-400 outline-none transition-all duration-200 ease-in-out focus:border-transparent focus:ring-2 focus:ring-neutral-500"
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
