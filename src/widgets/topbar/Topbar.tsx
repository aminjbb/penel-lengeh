import React, { useState, useEffect } from 'react';
import {
  Menu,
  Shield,
  RotateCcw,
  Clock,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../app/providers/StoreContext';
import { RoleKey } from '../../shared/types';
import { ROLES_CONFIG } from '../../shared/lib/permissions';

interface TopbarProps {
  onToggleMobileMenu: () => void;
  activeTabTitle: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleMobileMenu,
  activeTabTitle,
}) => {
  const { role, setRole, resetAllData } = useStore();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('fa-IR', {
          timeZone: 'Asia/Tehran',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRoleSelect = (r: RoleKey) => {
    setRole(r);
    setIsRoleDropdownOpen(false);
  };

  const currentRoleInfo = ROLES_CONFIG[role];

  return (
    <header className="h-16 bg-[#0f1117]/85 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      {/* Left side (in RTL, this is right side visually): Title and hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-xs hidden sm:inline">پنل لنگه /</span>
          <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
            {activeTabTitle}
          </h2>
        </div>
      </div>

      {/* Right side: Clock, Role Switcher, Reset button */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Tehran Clock */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-[#151824] border border-slate-800 rounded-full text-xs text-slate-300 font-mono">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>تهران: {timeString}</span>
        </div>

        {/* Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 py-1.5 px-3 bg-[#151824] hover:bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-slate-400">نقش فعال سیستم:</span>
              <span className="font-semibold text-slate-200">
                {currentRoleInfo.titleFa}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isRoleDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsRoleDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-2 w-72 bg-[#151824] border border-slate-700 rounded-xl shadow-2xl z-30 overflow-hidden divide-y divide-slate-800">
                <div className="p-3 bg-[#10121a]">
                  <p className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    انتخاب نقش کاربری (آزمون RBAC)
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    با تغییر نقش، مجوزهای دسترسی به بخش‌های مختلف بلافاصله اعمال می‌شوند.
                  </p>
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {(Object.keys(ROLES_CONFIG) as RoleKey[]).map((rKey) => {
                    const info = ROLES_CONFIG[rKey];
                    const isSelected = rKey === role;
                    return (
                      <button
                        key={rKey}
                        onClick={() => handleRoleSelect(rKey)}
                        className={`w-full text-right px-3.5 py-2 hover:bg-slate-800 transition-colors flex flex-col cursor-pointer ${
                          isSelected ? 'bg-blue-600/15 text-blue-200' : 'text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold">{info.titleFa}</span>
                          {isSelected && (
                            <span className="text-[10px] text-blue-400 font-bold">فعال</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                          {info.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Reset Data Button */}
        <button
          onClick={() => {
            if (confirm('آیا مطمئن هستید که می‌خواهید داده‌های پنل به حالت اولیه بازگردانی شوند؟')) {
              resetAllData();
            }
          }}
          title="بازنشانی داده‌ها به حالت اولیه"
          className="p-2 text-slate-400 hover:text-blue-400 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
