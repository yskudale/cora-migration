import React, { HTMLAttributes } from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface AppColorSwatchProps extends HTMLAttributes<HTMLDivElement> {
  color?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AppColorSwatch: React.FC<AppColorSwatchProps> = ({ 
  color = '#008000', 
  label, 
  size = 'md', 
  className = '',
  ...props 
}) => {
  const { theme } = useTheme();

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }[size] || 'w-4 h-4';

  if (theme === 'windows') {
    return (
      <div className={`inline-flex items-center gap-1.5 select-none ${className}`} {...props}>
        <span 
          className={`inline-block border border-[#808080] shadow-[inset_1px_1px_0px_#ffffff] ${sizeClasses}`} 
          style={{ backgroundColor: color }}
        />
        {label && <span className="font-sans text-[11px] text-black">{label}</span>}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`} {...props}>
      <span 
        className={`inline-block rounded-full shadow-xs ring-1 ring-slate-200 ${sizeClasses}`} 
        style={{ backgroundColor: color }}
      />
      {label && <span className="text-xs font-medium text-slate-700">{label}</span>}
    </div>
  );
};