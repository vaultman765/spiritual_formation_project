import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => (
  <div className={`bg-white dark:bg-zinc-900 rounded-2xl shadow-md p-4 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = "" }: CardProps) => (
  <div className={`space-y-4 ${className}`}>{children}</div>
);
