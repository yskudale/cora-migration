import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';

export interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  children?: ReactNode;
  variant?: ButtonVariant;
}

const modernVariantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 shadow-sm',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 focus:ring-slate-400 shadow-sm',
  outline: 'border border-indigo-600 text-indigo-700 hover:bg-indigo-50 focus:ring-indigo-500 shadow-sm',
  danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm',
  ghost: 'text-slate-700 hover:bg-slate-100 focus:ring-slate-400',
};

export const AppButton: React.FC<AppButtonProps> = ({ 
  children, 
  icon, 
  onClick, 
  variant = 'primary',
  className = '', 
  ...props 
}) => {
  const { theme } = useTheme();

  // Windows Classic Style: Retains uniform 3D bevel regardless of variant
  if (theme === 'windows') {
    return (
      <button
        onClick={onClick}
        className={`bg-[#F0EEEF] border-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white px-3 py-0.5 font-sans text-[11px] text-black cursor-pointer outline-none select-none flex items-center justify-center gap-1.5 focus:outline-1 focus:outline-dotted focus:outline-black disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        {icon && <span className="inline-flex items-center text-[12px]">{icon}</span>}
        {children && <span>{children}</span>}
      </button>
    );
  }

  // Modern Tailwind Style: Dynamic variant styling
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${modernVariantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex items-center">{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  );
};