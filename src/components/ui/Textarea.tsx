interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	error?: string;
}

export default function Textarea({ label, error, ...props }: TextareaProps) {
	return (
		<div className="w-full">
			{label && (
				<label className="mb-1 block  text-gray-700">{label}</label>
			)}
			<textarea
				{...props}
				className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-neutral-500 focus:border-transparent outline-none text-gray-700 transition-all duration-200 ease-in-out placeholder-gray-400 resize-y min-h-[100px]"
			/>
			{error && <p className="mt-1 text-sm text-red-500">{error}</p>}
		</div>
	);
}
