import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface AppTabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
}

export const AppTab: React.FC<AppTabProps> = ({ 
  label, 
  active = false, 
  onClick, 
  className = '',
  children,
  ...props 
}) => {
  const { theme } = useTheme();

  if (theme === 'windows') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`px-2 py-0.5 font-sans text-[11px] select-none cursor-pointer outline-none border-t border-l border-r -mb-[1px] ${
          active 
            ? 'bg-[#D4D0C8] border-t-white border-l-white border-r-[#808080] text-black font-bold z-10 shadow-[1px_-1px_0px_#404040]' 
            : 'bg-[#C0C0C0] border-t-white border-l-white border-r-[#808080] text-black font-normal hover:bg-[#D4D0C8]'
        } ${className}`}
        {...props}
      >
        {label || children}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 font-medium text-xs rounded-t-lg transition-colors border-b-2 ${
        active 
          ? 'bg-white border-indigo-600 text-indigo-600 shadow-xs' 
          : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
      } ${className}`}
      {...props}
    >
      {label || children}
    </button>
  );
};