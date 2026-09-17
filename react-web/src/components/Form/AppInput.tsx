import React, { InputHTMLAttributes } from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface AppInputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'required';
}

export const AppInput: React.FC<AppInputProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  type = 'text',
  readOnly = false,
  disabled = false,
  variant = 'default',
  className = '', 
  ...props 
}) => {
  const { theme } = useTheme();

  if (theme === 'windows') {
    const bgClass = variant === 'required' ? 'bg-[#FFEFF2]' : (readOnly || disabled ? 'bg-[#F0EEEF]' : 'bg-white');
    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        className={`border border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff] shadow-[inset_1px_1px_0px_#404040,inset_-1px_-1px_0px_#d4d0c8] px-1.5 py-0.5 font-sans text-[11px] text-black outline-none h-[22px] disabled:text-gray-500 ${bgClass} ${className}`}
        {...props}
      />
    );
  }

  const bgClass = variant === 'required' ? 'bg-rose-50 border-rose-300' : 'bg-white border-slate-300';
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      disabled={disabled}
      className={`px-3 py-1.5 border rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 transition-colors ${bgClass} ${className}`}
      {...props}
    />
  );
};