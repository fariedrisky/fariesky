import React from "react";

export default function Title({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="mb-8">
			<span className="inline-block px-4 py-2 text-md rounded-2xl cursor-pointer border bg-gray-100 border-gray-200 text-gray-800 font-bold">
				{children}
			</span>
		</div>
	);
}
