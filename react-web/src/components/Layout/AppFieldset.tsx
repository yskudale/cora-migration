import React, { FieldsetHTMLAttributes, ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface AppFieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend?: string;
  legendColor?: string;
  children?: ReactNode;
  className?: string;
}

export const AppFieldset: React.FC<AppFieldsetProps> = ({ 
  legend, 
  legendColor = 'text-black', 
  children, 
  className = '',
  ...props 
}) => {
  const { theme } = useTheme();

  if (theme === 'windows') {
    return (
      <fieldset 
        className={`border border-[#808080] shadow-[1px_1px_0px_#ffffff] p-2.5 text-[11px] font-sans relative bg-[#F0EEEF] ${className}`}
        {...props}
      >
        {legend && (
          <legend className={`px-1 bg-[#F0EEEF] font-sans text-[11px] font-normal ${legendColor}`}>
            {legend}
          </legend>
        )}
        {children}
      </fieldset>
    );
  }

  return (
    <fieldset 
      className={`border border-slate-200 rounded-xl p-4 relative bg-slate-50/50 ${className}`}
      {...props}
    >
      {legend && (
        <legend className="px-2 text-xs font-semibold text-slate-600 bg-white rounded-md border border-slate-200 shadow-xs">
          {legend}
        </legend>
      )}
      {children}
    </fieldset>
  );
};