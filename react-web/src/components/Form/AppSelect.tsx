import React, { SelectHTMLAttributes, ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface AppSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: (string | SelectOption)[];
  variant?: 'default' | 'required';
  children?: ReactNode;
}

export const AppSelect: React.FC<AppSelectProps> = ({ 
  value, 
  onChange, 
  options = [], 
  variant = 'default', 
  className = '', 
  children,
  ...props 
}) => {
  const { theme } = useTheme();

  if (theme === 'windows') {
    const bgClass = variant === 'required' ? 'bg-[#FFEFF2]' : 'bg-white text-black';
    return (
      <select
        value={value}
        onChange={onChange}
        className={`border border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff] shadow-[inset_1px_1px_0px_#404040] px-1 py-0.5 font-sans text-[11px] outline-none cursor-pointer h-[22px] ${bgClass} ${className}`}
        {...props}
      >
        {children || options.map((opt, i) => (
          <option key={i} value={typeof opt === 'object' ? opt.value : opt} className="bg-white text-black">
            {typeof opt === 'object' ? opt.label : opt}
          </option>
        ))}
      </select>
    );
  }

  return (
    <select
      value={value}
      onChange={onChange}
      className={`px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${className}`}
      {...props}
    >
      {children || options.map((opt, i) => (
        <option key={i} value={typeof opt === 'object' ? opt.value : opt}>
          {typeof opt === 'object' ? opt.label : opt}
        </option>
      ))}
    </select>
  );
};