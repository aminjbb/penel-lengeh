import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-[#151823]/90 border border-slate-800/80 rounded-xl backdrop-blur-sm p-5 transition-all duration-200 ${
        hoverable ? 'hover:border-slate-700 hover:shadow-lg hover:shadow-black/50 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
