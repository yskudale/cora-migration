import React, { LabelHTMLAttributes, ReactNode, MouseEvent } from 'react';
import { useTheme } from '../../context/ThemeContext';

export type LabelVariant = 'default' | 'bold' | 'required' | 'link' | 'error';

export interface AppLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children?: ReactNode;
  variant?: LabelVariant;
  onClick?: (e: MouseEvent<HTMLLabelElement>) => void;
}

export const AppLabel: React.FC<AppLabelProps> = ({ 
  children, 
  variant = 'default', 
  className = '',
  onClick,
  ...props 
}) => {
  const { theme } = useTheme();

  let variantStyles = '';
  
  if (theme === 'windows') {
    switch (variant) {
      case 'bold':
        variantStyles = 'font-bold text-black';
        break;
      case 'required':
        variantStyles = 'font-normal text-[#C00000]';
        break;
      case 'link':
        variantStyles = 'text-[#000080] underline cursor-pointer hover:text-blue-600';
        break;
      case 'error':
        variantStyles = 'font-bold text-[#C00000]';
        break;
      default:
        variantStyles = 'font-normal text-black';
    }
    return (
      <label 
        onClick={onClick}
        className={`font-sans text-[11px] select-none ${variantStyles} ${className}`} 
        {...props}
      >
        {children}
      </label>
    );
  }

  switch (variant) {
    case 'bold':
      variantStyles = 'font-semibold text-slate-900';
      break;
    case 'required':
      variantStyles = 'font-medium text-rose-600';
      break;
    case 'link':
      variantStyles = 'text-indigo-600 hover:text-indigo-800 font-medium underline cursor-pointer';
      break;
    case 'error':
      variantStyles = 'font-semibold text-rose-600';
      break;
    default:
      variantStyles = 'font-medium text-slate-700';
  }

  return (
    <label 
      onClick={onClick}
      className={`text-xs ${variantStyles} ${className}`} 
      {...props}
    >
      {children}
    </label>
  );
};