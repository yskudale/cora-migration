import React, { HTMLAttributes } from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface AppPatientInfoLabelProps extends HTMLAttributes<HTMLDivElement> {
  sysId: string;
  name: string;
  reason: string;
  className?: string;
}

export const AppPatientInfoLabel: React.FC<AppPatientInfoLabelProps> = ({ 
  sysId, 
  name, 
  reason, 
  className = '',
  ...props 
}) => {
  const { theme } = useTheme();

  if (theme === 'windows') {
    return (
      <div className={`font-sans text-[11px] text-black font-normal bg-[#D4D0C8] px-1 py-0.5 border-b border-[#808080] ${className}`} {...props}>
        Patient/Admission -<span className="text-[#000080] font-semibold">{sysId}</span> - {name}/ Admitted For - {reason}
      </div>
    );
  }

  // Modern Theme
  return (
    <div className={`text-xs font-medium text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 ${className}`} {...props}>
      Patient/Admission - <span className="text-indigo-600 font-semibold">{sysId}</span> - {name} / Admitted For - {reason}
    </div>
  );
};