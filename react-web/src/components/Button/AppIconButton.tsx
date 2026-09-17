import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ButtonVariant } from './AppButton';

export interface AppIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  title?: string;
  variant?: ButtonVariant;
}

const modernIconButtonVariantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 shadow-sm',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 focus:ring-slate-400 shadow-sm',
  outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-indigo-500',
  danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm',
  ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 focus:ring-indigo-500',
};

export const AppIconButton: React.FC<AppIconButtonProps> = ({ 
  icon, 
  onClick, 
  title, 
  variant = 'ghost',
  className = '', 
  disabled = false, 
  ...props 
}) => {
  const { theme } = useTheme();

  // Windows Classic Style: Compact beveled square across all variants
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

  // Modern Tailwind Style: Dynamic variant styling
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`p-1.5 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center ${modernIconButtonVariantStyles[variant]} ${className}`}
      {...props}
    >
      <span className="inline-flex items-center justify-center">{icon}</span>
    </button>
  );
};