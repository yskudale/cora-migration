import React, { HTMLAttributes, ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { AppIconButton } from '../Button/AppIconButton';

export interface ExtraNavButton {
  icon: ReactNode;
  title?: string;
  onClick?: () => void;
}

export interface AppRecordNavBarProps extends HTMLAttributes<HTMLDivElement> {
  currentIndex?: number;
  onFirst?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onLast?: () => void;
  extraButtons?: ExtraNavButton[];
  className?: string;
}

export const AppRecordNavBar: React.FC<AppRecordNavBarProps> = ({ 
  currentIndex = 1, 
  onFirst, 
  onPrev, 
  onNext, 
  onLast,
  extraButtons = [],
  className = '',
  ...props 
}) => {
  const { theme } = useTheme();

  if (theme === 'windows') {
    return (
      <div className={`flex items-center gap-1 bg-[#F0EEEF] p-0.5 border-t border-[#808080] font-sans text-[11px] text-black ${className}`} {...props}>
        <AppIconButton icon="|◄" title="First Record" onClick={onFirst} />
        <AppIconButton icon="◄" title="Previous Record" onClick={onPrev} />
        <AppIconButton icon="►" title="Next Record" onClick={onNext} />
        <AppIconButton icon="►|" title="Last Record" onClick={onLast} />
        
        <span className="px-1 font-bold text-[11px] min-w-[20px] text-center">{currentIndex}</span>

        {extraButtons.map((btn, idx) => (
          <AppIconButton
            key={idx}
            icon={btn.icon}
            title={btn.title}
            onClick={btn.onClick}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs text-slate-700 ${className}`} {...props}>
      <AppIconButton icon="|◄" title="First Record" onClick={onFirst} />
      <AppIconButton icon="◄" title="Previous Record" onClick={onPrev} />
      <AppIconButton icon="►" title="Next Record" onClick={onNext} />
      <AppIconButton icon="►|" title="Last Record" onClick={onLast} />
      
      <span className="px-2 font-semibold text-xs min-w-[24px] text-center text-slate-800">{currentIndex}</span>

      {extraButtons.map((btn, idx) => (
        <AppIconButton
          key={idx}
          icon={btn.icon}
          title={btn.title}
          onClick={btn.onClick}
        />
      ))}
    </div>
  );
};