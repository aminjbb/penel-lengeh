import React, { useEffect, useState } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'full';
  fullScreen?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'lg',
  fullScreen = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(fullScreen || maxWidth === 'full');

  useEffect(() => {
    setIsExpanded(fullScreen || maxWidth === 'full');
  }, [fullScreen, maxWidth, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-none',
  };

  const dialogClasses = isExpanded
    ? 'fixed inset-2 sm:inset-4 w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] max-w-none max-h-none flex flex-col my-0 rounded-2xl'
    : `relative w-full ${widthClasses[maxWidth]} my-8 rounded-2xl flex flex-col`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`${dialogClasses} bg-[#141721] border border-slate-700/80 shadow-2xl shadow-black/90 z-10 overflow-hidden transform transition-all duration-200`}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-800 bg-[#11131a]/90 shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-500 rounded-full inline-block" />
              {title}
            </h3>
            {description && (
              <p className="text-xs text-slate-400 mt-1">{description}</p>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Toggle Fullscreen button */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-slate-400 hover:text-blue-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title={isExpanded ? 'خروج از حالت تمام‌صفحه' : 'حالت تمام‌صفحه'}
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="بستن"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
