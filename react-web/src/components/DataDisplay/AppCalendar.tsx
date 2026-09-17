import React, { useState, HTMLAttributes } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { AppIconButton } from '../Button/AppIconButton';

export interface AppCalendarProps extends HTMLAttributes<HTMLDivElement> {
  selectedDate?: string;
  onSelectDate?: (day: number) => void;
  className?: string;
}

export const AppCalendar: React.FC<AppCalendarProps> = ({ 
  selectedDate = 'Wed, Aug 5, 2026', 
  onSelectDate,
  className = '',
  ...props 
}) => {
  const { theme } = useTheme();
  const [currentMonth] = useState<string>('August');
  const [currentYear] = useState<string>('2026');

  const daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysInMonth: number[] = Array.from({ length: 31 }, (_, i) => i + 1);

  if (theme === 'windows') {
    return (
      <div className={`bg-[#F0EEEF] border border-[#808080] p-1 font-sans text-[11px] select-none w-56 ${className}`} {...props}>
        {/* Month/Year Header */}
        <div className="flex items-center justify-between bg-white border border-[#7F9DB9] px-1.5 py-0.5 mb-1">
          <span className="font-bold text-black">{currentMonth} {currentYear}</span>
          <AppIconButton icon="⇨" title="Next Month" className="h-4 w-4 text-[10px]" />
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 text-center font-bold text-[#808080] border-b border-[#808080] pb-0.5 mb-1">
          {daysOfWeek.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0.5 text-center">
          {daysInMonth.map((day) => {
            const isSelected = day === 5;
            return (
              <button
                key={day}
                type="button"
                onClick={() => onSelectDate && onSelectDate(day)}
                className={`py-0.5 text-[11px] cursor-pointer ${
                  isSelected 
                    ? 'bg-blue-600 text-white font-bold' 
                    : 'bg-white text-black hover:bg-[#ECE9D8]'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Selected Date Output */}
        <div className="mt-1.5 pt-1 border-t border-[#808080] text-[10px] text-black">
          Selected Date(s): <span className="font-bold">{selectedDate}</span>
        </div>
      </div>
    );
  }

  // Modern Theme
  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-3 shadow-xs text-xs w-64 ${className}`} {...props}>
      <div className="flex items-center justify-between font-semibold text-slate-800 mb-2 px-1">
        <span>{currentMonth} {currentYear}</span>
        <AppIconButton icon="⇨" title="Next Month" />
      </div>

      <div className="grid grid-cols-7 text-center font-medium text-slate-400 mb-1">
        {daysOfWeek.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {daysInMonth.map((day) => {
          const isSelected = day === 5;
          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelectDate && onSelectDate(day)}
              className={`py-1 rounded-md text-xs font-medium transition-colors ${
                isSelected 
                  ? 'bg-indigo-600 text-white font-bold shadow-xs' 
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-3 pt-2 border-t border-slate-100 text-slate-500 text-[11px]">
        Selected: <span className="font-semibold text-indigo-600">{selectedDate}</span>
      </div>
    </div>
  );
};