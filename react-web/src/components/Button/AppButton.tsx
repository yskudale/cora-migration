import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  children?: ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({ 
  children, 
  icon, 
  onClick, 
  className = '', 
  ...props 
}) => {
  const { theme } = useTheme();

  // Windows Classic Style
  if (theme === 'windows') {
    return (
      <button
        onClick={onClick}
        className={`bg-[#F0EEEF] border-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white px-3 py-0.5 font-sans text-[11px] text-black cursor-pointer outline-none select-none flex items-center justify-center gap-1.5 focus:outline-1 focus:outline-dotted focus:outline-black ${className}`}
        {...props}
      >
        {icon && <span className="inline-flex items-center text-[12px]">{icon}</span>}
        {children && <span>{children}</span>}
      </button>
    );
  }

  // Modern Tailwind Style
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 inline-flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex items-center">{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  );
};