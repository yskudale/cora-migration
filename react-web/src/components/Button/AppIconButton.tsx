import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface AppIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  title?: string;
}

export const AppIconButton: React.FC<AppIconButtonProps> = ({ 
  icon, 
  onClick, 
  title, 
  className = '', 
  disabled = false, 
  ...props 
}) => {
  const { theme } = useTheme();

  // Windows Classic Style (Compact Beveled Square)
  if (theme === 'windows') {
    return (
      <button
        onClick={onClick}
        title={title}
        disabled={disabled}
        className={`bg-[#C0C0C0] border-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white min-w-[22px] h-[22px] px-1 font-sans text-[11px] text-black cursor-pointer outline-none select-none disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center ${className}`}
        {...props}
      >
        <span className="inline-flex items-center justify-center">{icon}</span>
      </button>
    );
  }

  // Modern Tailwind Style (Clean Subtle Circle / Square Button)
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center ${className}`}
      {...props}
    >
      <span className="inline-flex items-center justify-center">{icon}</span>
    </button>
  );
};