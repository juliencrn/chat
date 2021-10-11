import React from "react";

interface LayoutProps {
  children: React.ReactChild;
  title: string;
}

function PublicLayout({ children, title }: LayoutProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="w-full max-w-xs m-auto">
        <h2 className="font-bold text-xl tracking-wide mb-2 text-center">
          {title}
        </h2>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default PublicLayout;
