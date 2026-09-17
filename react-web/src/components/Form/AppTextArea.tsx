import React, { TextareaHTMLAttributes } from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface AppTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'error';
}

export const AppTextArea: React.FC<AppTextAreaProps> = ({ 
  value, 
  onChange, 
  rows = 4, 
  readOnly = false,
  variant = 'default', 
  className = '', 
  ...props 
}) => {
  const { theme } = useTheme();

  if (theme === 'windows') {
    const textColor = variant === 'error' ? 'text-[#C00000] font-semibold' : 'text-black';
    return (
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        readOnly={readOnly}
        className={`w-full bg-white border border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff] shadow-[inset_1px_1px_0px_#404040,inset_-1px_-1px_0px_#d4d0c8] p-1 font-sans text-[11px] outline-none resize-none ${textColor} ${className}`}
        {...props}
      />
    );
  }

  const textColor = variant === 'error' ? 'text-rose-600 font-medium' : 'text-slate-800';
  return (
    <textarea
      value={value}
      onChange={onChange}
      rows={rows}
      readOnly={readOnly}
      className={`w-full p-2 border border-slate-300 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${textColor} ${className}`}
      {...props}
    />
  );
};