import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'amber' | 'emerald' | 'blue' | 'rose' | 'purple' | 'zinc' | 'cyan';
  size?: 'sm' | 'md';
  className?: string;
  title?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'zinc',
  size = 'sm',
  className = '',
  title,
}) => {
  const variantStyles = {
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    blue: 'bg-blue-600/20 text-blue-300 border-blue-500/40',
    rose: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    purple: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    zinc: 'bg-slate-800/80 text-slate-300 border-slate-700/80',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
