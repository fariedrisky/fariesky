import React from "react";

// Card Container
interface CardProps {
  className?: string;
  children?: React.ReactNode;
}

const Card = ({ className = "", children }: CardProps) => {
  return (
    <div
      className={`cursor-pointer overflow-hidden rounded-3xl border bg-white p-6 transition-all duration-300 hover:shadow-lg ${className}`}
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
    <h3 className={`text-xl font-semibold text-gray-800 ${className}`}>
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
  return <p className={`mt-2 text-gray-600 ${className}`}>{children}</p>;
};

// Card Content
interface CardContentProps {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const CardContent = ({
  className = "",
  children,
  onClick,
}: CardContentProps) => {
  return (
    <div className={`${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

// Card Footer
interface CardFooterProps {
  className?: string;
  children?: React.ReactNode;
}

const CardFooter = ({ className = "", children }: CardFooterProps) => {
  return (
    <div className={`flex items-center gap-4 p-6 pt-0 ${className}`}>
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
