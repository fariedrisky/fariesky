import React from "react";

export default function Title({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="mb-6">
      <span className="sm:text-md inline-block cursor-pointer rounded-2xl border border-gray-200 bg-gray-100 px-4 py-2 text-base font-bold uppercase text-gray-800">
        {children}
      </span>
    </div>
  );
}
