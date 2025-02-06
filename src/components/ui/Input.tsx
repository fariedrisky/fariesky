interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
}

export default function Input({ label, error, ...props }: InputProps) {
	return (
		<div className="w-full">
			{label && (
				<label className="mb-1 block text-gray-700">{label}</label>
			)}
			<input
				{...props}
				className="w-full px-4 py-2 border border-gray-200 rounded-xl 
			outline-none text-gray-700 placeholder-gray-400
			transition-all duration-200 ease-in-out
			focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
			/>
			{error && <p className="mt-1 text-sm text-red-500">{error}</p>}
		</div>
	);
}
