import React, { InputHTMLAttributes, ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface AppRadioButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
}

export const AppRadioButton: React.FC<AppRadioButtonProps> = ({ 
  label, 
  name, 
  value, 
  checked, 
  onChange, 
  disabled = false,
  className = '', 
  ...props 
}) => {
  const { theme } = useTheme();

  if (theme === 'windows') {
    return (
      <label className={`inline-flex items-center gap-1.5 font-sans text-[11px] text-black select-none cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="w-3.5 h-3.5   cursor-pointer"
          {...props}
        />
        {label && <span>{label}</span>}
      </label>
    );
  }

  return (
    <label className={`inline-flex items-center gap-2 text-xs text-slate-700 select-none cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
};