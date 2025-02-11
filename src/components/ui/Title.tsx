import React from "react";

interface TitleProps {
  children: React.ReactNode;
  marginBottom?: string;
}

export default function Title({
  children,
  marginBottom = "mb-6",
}: Readonly<TitleProps>) {
  return (
    <div className={`${marginBottom}`}>
      <span className="sm:text-md inline-block cursor-pointer rounded-2xl border border-gray-200 bg-gray-100 px-4 py-2 text-base font-bold uppercase text-gray-800">
        {children}
      </span>
    </div>
  );
}
