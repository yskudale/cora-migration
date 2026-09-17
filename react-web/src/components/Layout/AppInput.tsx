import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const AppInput = ({ value, onChange, placeholder, className = '', ...props }) => {
  const { theme } = useTheme();

  // Windows Classic Style via Tailwind
  if (theme === 'windows') {
    return (
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`bg-white text-black border-2 border-t-[#7F9DB9] border-l-[#7F9DB9] border-b-white border-r-white px-1.5 py-0.5 font-sans text-[12px] outline-none ${className}`}
        {...props}
      />
    );
  }

  // Modern Tailwind Style
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${className}`}
      {...props}
    />
  );
};