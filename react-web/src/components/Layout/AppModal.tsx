import React, { HTMLAttributes, ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface AppModalProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  children?: ReactNode;
  onClose?: () => void;
}

export const AppModal: React.FC<AppModalProps> = ({ 
  title, 
  children, 
  onClose 
}) => {
  const { theme } = useTheme();

  if (theme === 'windows') {
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[1000] p-2">
        <div className="bg-[#F0EEEF] border-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] shadow-md w-[850px] max-w-full p-1 font-sans text-black">
          {/* Java Swing Title Bar */}
          <div className="bg-[#F0EEEF] px-2 py-0.5 flex justify-between items-center text-[12px] select-none font-sans border-b border-[#808080] mb-1">
            <div className="flex items-center gap-1.5 text-black font-normal">
              <span className="text-[14px] leading-none">☕</span>
              <span>{title}</span>
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-4 h-4 bg-[#F0EEEF] border border-t-white border-l-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] text-black font-bold text-[10px] leading-none flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
          {/* Window Body */}
          <div className="p-2 bg-[#F0EEEF]">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-800">{title}</h3>
          {onClose && (
            <button 
              type="button"
              onClick={onClose} 
              className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};