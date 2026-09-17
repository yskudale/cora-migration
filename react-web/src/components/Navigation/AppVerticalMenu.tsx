import React, { HTMLAttributes, ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { AppIconButton } from '../Button/AppIconButton';

export interface VerticalMenuItem {
  icon: ReactNode;
  title?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface AppVerticalMenuProps extends HTMLAttributes<HTMLDivElement> {
  items?: VerticalMenuItem[];
  className?: string;
}

export const AppVerticalMenu: React.FC<AppVerticalMenuProps> = ({ 
  items = [], 
  className = '',
  ...props 
}) => {
  const { theme } = useTheme();

  if (theme === 'windows') {
    return (
      <div className={`flex flex-col gap-1 bg-[#F0EEEF] p-1 border border-[#808080] ${className}`} {...props}>
        {items.map((item, idx) => (
          <AppIconButton
            key={idx}
            icon={item.icon}
            title={item.title}
            onClick={item.onClick}
            disabled={item.disabled}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200 ${className}`} {...props}>
      {items.map((item, idx) => (
        <AppIconButton
          key={idx}
          icon={item.icon}
          title={item.title}
          onClick={item.onClick}
          disabled={item.disabled}
        />
      ))}
    </div>
  );
};