import React from "react";

// Types untuk props button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link";
	size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{ className = "", variant = "default", size = "default", ...props },
		ref
	) => {
		// Base styles yang selalu diaplikasikan
		const baseStyles =
			"inline-flex rounded-2xl items-center justify-center whitespace-nowrap  font-medium transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 disabled:pointer-events-none disabled:opacity-50";

		// Variant styles
		const variantStyles = {
			default: "bg-primary text-white shadow hover:bg-primary/80",
			destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700",
			outline:
				"border border-gray-300 bg-white shadow-sm hover:bg-gray-100 hover:text-gray-900",
			secondary: "bg-gray-200 text-gray-900 shadow-sm hover:bg-gray-300",
			ghost: "hover:bg-gray-100 hover:text-gray-900",
			link: "text-blue-600 underline-offset-4 hover:underline",
		};

		// Size styles
		const sizeStyles = {
			default: "h-9 px-4 py-2",
			sm: "h-8 px-3 text-xs",
			lg: "h-10 px-8",
			icon: "h-9 w-9",
		};

		// Combine all styles
		const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

		return <button className={combinedClassName} ref={ref} {...props} />;
	}
);

Button.displayName = "Button";

export { Button };

// Contoh penggunaan:
// <Button>Default Button</Button>
// <Button variant="destructive">Delete</Button>
// <Button variant="outline" size="lg">Large Outline</Button>
// <Button variant="ghost" size="sm">Small Ghost</Button>
// <Button variant="link">Link Style</Button>
// <Button variant="secondary" size="icon"><IconComponent /></Button>
