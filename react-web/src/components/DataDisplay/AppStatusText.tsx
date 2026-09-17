import React, { HTMLAttributes, ReactNode, MouseEvent } from 'react';
import { useTheme } from '../../context/ThemeContext';

export type StatusType = 'info' | 'warning' | 'error' | 'success' | 'link';

export interface AppStatusTextProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  status?: StatusType;
  className?: string;
  onClick?: (e: MouseEvent<HTMLSpanElement>) => void;
}

export const AppStatusText: React.FC<AppStatusTextProps> = ({ 
  children, 
  status = 'info', 
  className = '',
  onClick,
  ...props 
}) => {
  const { theme } = useTheme();

  if (theme === 'windows') {
    let colorClass = 'text-black';
    if (status === 'error' || status === 'warning') colorClass = 'text-[#C00000] font-normal';
    if (status === 'success') colorClass = 'text-[#008000] font-normal';
    if (status === 'link') colorClass = 'text-[#000080] underline cursor-pointer';

    return (
      <span 
        onClick={onClick}
        className={`font-sans text-[11px] select-none ${colorClass} ${className}`} 
        {...props}
      >
        {children}
      </span>
    );
  }

  // Modern Theme
  let colorClass = 'text-slate-600';
  if (status === 'error' || status === 'warning') colorClass = 'text-rose-600 font-medium';
  if (status === 'success') colorClass = 'text-emerald-600 font-medium';
  if (status === 'link') colorClass = 'text-indigo-600 underline font-medium cursor-pointer';

  return (
    <span 
      onClick={onClick}
      className={`text-xs ${colorClass} ${className}`} 
      {...props}
    >
      {children}
    </span>
  );
};