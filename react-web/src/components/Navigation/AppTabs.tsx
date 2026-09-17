import React, { HTMLAttributes, ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface AppTabsProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export const AppTabs: React.FC<AppTabsProps> = ({ 
  children, 
  className = '',
  ...props 
}) => {
  const { theme } = useTheme();

  if (theme === 'windows') {
    return (
      <div className={`flex items-end border-b border-[#808080] gap-0.5 font-sans ${className}`} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 border-b border-slate-200 ${className}`} {...props}>
      {children}
    </div>
  );
};