import React, { HTMLAttributes } from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface AppVerticalTabListProps extends HTMLAttributes<HTMLDivElement> {
  tabs?: string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  className?: string;
}

export const AppVerticalTabList: React.FC<AppVerticalTabListProps> = ({ 
  tabs = ['1', '2', '3', '4'], 
  activeTab = '1', 
  onTabChange, 
  className = '',
  ...props 
}) => {
  const { theme } = useTheme();

  if (theme === 'windows') {
    return (
      <div className={`flex flex-col gap-0.5 select-none ${className}`} {...props}>
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange && onTabChange(tab)}
              className={`w-5 h-5 font-sans text-[11px] border flex items-center justify-center cursor-pointer ${
                isActive
                  ? 'bg-[#000080] text-white font-bold border-[#000080]'
                  : 'bg-[#C0C0C0] text-black border-t-white border-l-white border-b-[#404040] border-r-[#404040]'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1 select-none ${className}`} {...props}>
      {tabs.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange && onTabChange(tab)}
            className={`w-7 h-7 text-xs font-semibold rounded-lg flex items-center justify-center transition-colors ${
              isActive
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};