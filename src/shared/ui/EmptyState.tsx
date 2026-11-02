import React from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'موردی یافت نشد',
  description = 'هیچ داده‌ای برای نمایش با این فیلترها وجود ندارد.',
  icon,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-900/30">
      <div className="w-12 h-12 rounded-full bg-neutral-800/80 flex items-center justify-center text-neutral-400 mb-3">
        {icon || <PackageOpen className="w-6 h-6 text-neutral-500" />}
      </div>
      <h4 className="text-sm font-semibold text-neutral-200">{title}</h4>
      <p className="text-xs text-neutral-400 max-w-sm mt-1">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
