import React from "react";

// Card Container
interface CardProps {
	className?: string;
	children?: React.ReactNode;
}

const Card = ({ className = "", children }: CardProps) => {
	return (
		<div
			className={`bg-white cursor-pointer p-6 rounded-3xl border overflow-hidden hover:shadow-lg transition-all duration-300 ${className}`}
		>
			{children}
		</div>
	);
};

// Card Header
interface CardHeaderProps {
	className?: string;
	children?: React.ReactNode;
}

const CardHeader = ({ className = "", children }: CardHeaderProps) => {
	return <div className={`p-6 pb-3 ${className}`}>{children}</div>;
};

// Card Title
interface CardTitleProps {
	className?: string;
	children?: React.ReactNode;
}

const CardTitle = ({ className = "", children }: CardTitleProps) => {
	return (
		<h3 className={` text-xl font-semibold text-gray-800 ${className}`}>
			{children}
		</h3>
	);
};

// Card Description
interface CardDescriptionProps {
	className?: string;
	children?: React.ReactNode;
}

const CardDescription = ({
	className = "",
	children,
}: CardDescriptionProps) => {
	return <p className={`text-gray-600 mt-2 ${className}`}>{children}</p>;
};

// Card Content
interface CardContentProps {
	className?: string;
	children?: React.ReactNode;
}

const CardContent = ({ className = "", children }: CardContentProps) => {
	return <div className={`${className}`}>{children}</div>;
};

// Card Footer
interface CardFooterProps {
	className?: string;
	children?: React.ReactNode;
}

const CardFooter = ({ className = "", children }: CardFooterProps) => {
	return (
		<div className={`p-6 pt-0 flex items-center gap-4 ${className}`}>
			{children}
		</div>
	);
};

export {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
};
