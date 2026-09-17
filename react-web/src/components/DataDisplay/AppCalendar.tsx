import React, { useState, HTMLAttributes } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { AppIconButton } from '../Button/AppIconButton';

export interface AppCalendarProps extends HTMLAttributes<HTMLDivElement> {
  selectedDay?: number;
  onSelectDate?: (date: Date) => void;
  className?: string;
}

export const AppCalendar: React.FC<AppCalendarProps> = ({ 
  selectedDay: controlledSelectedDay,
  onSelectDate,
  className = '',
  ...props 
}) => {
  const { theme } = useTheme();

  // Active viewing date (defaults to August 2026)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 7, 1));
  const [internalSelectedDay, setInternalSelectedDay] = useState<number>(5);

  const activeDay = controlledSelectedDay ?? internalSelectedDay;

  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();

  const months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Configurable year range (1970 - 2070)
  const years: number[] = Array.from({ length: 101 }, (_, i) => 1970 + i);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, monthIndex - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, monthIndex + 1, 1));
  };

  // Select change handlers
  const handleMonthSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value, 10);
    setCurrentDate(new Date(year, newMonth, 1));
  };

  const handleYearSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value, 10);
    setCurrentDate(new Date(newYear, monthIndex, 1));
  };

  const handleDateClick = (day: number) => {
    setInternalSelectedDay(day);
    if (onSelectDate) {
      onSelectDate(new Date(year, monthIndex, day));
    }
  };

  const daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Grid calculations
  const totalDaysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayIndex = new Date(year, monthIndex, 1).getDay();
  const daysInMonth: number[] = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
  const paddingSlots: number[] = Array.from({ length: firstDayIndex }, (_, i) => i);

  const formattedSelected = `${months[monthIndex].slice(0, 3)} ${activeDay}, ${year}`;

  if (theme === 'windows') {
    return (
      <div className={`bg-[#F0EEEF] border border-[#808080] p-1 font-sans text-[11px] select-none w-64 ${className}`} {...props}>
        {/* Header Controls with Month & Year Selectors */}
        <div className="flex items-center justify-between bg-white border border-[#7F9DB9] px-1 py-0.5 mb-1 gap-1">
          <AppIconButton icon="⇦" title="Previous Month" onClick={handlePrevMonth} className="h-4 w-4 text-[10px]" />
          
          <div className="flex items-center gap-1">
            <select
              value={monthIndex}
              onChange={handleMonthSelect}
              className="bg-white text-black font-bold text-[11px] outline-none cursor-pointer border-none py-0 focus:bg-blue-600 focus:text-white"
            >
              {months.map((m, idx) => (
                <option key={m} value={idx} className="bg-white text-black">{m}</option>
              ))}
            </select>

            <select
              value={year}
              onChange={handleYearSelect}
              className="bg-white text-black font-bold text-[11px] outline-none cursor-pointer border-none py-0 focus:bg-blue-600 focus:text-white"
            >
              {years.map((y) => (
                <option key={y} value={y} className="bg-white text-black">{y}</option>
              ))}
            </select>
          </div>

          <AppIconButton icon="⇨" title="Next Month" onClick={handleNextMonth} className="h-4 w-4 text-[10px]" />
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 text-center font-bold text-[#808080] border-b border-[#808080] pb-0.5 mb-1">
          {daysOfWeek.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>

        {/* Date Grid */}
        <div className="grid grid-cols-7 gap-0.5 text-center">
          {paddingSlots.map((p) => (
            <div key={`pad-${p}`} className="py-0.5" />
          ))}
          {daysInMonth.map((day) => {
            const isSelected = day === activeDay;
            return (
              <button
                key={day}
                type="button"
                onClick={() => handleDateClick(day)}
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
          Selected Date(s): <span className="font-bold">{formattedSelected}</span>
        </div>
      </div>
    );
  }

  // Modern Theme
  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-3 shadow-xs text-xs w-68 ${className}`} {...props}>
      {/* Header Controls with Month & Year Dropdowns */}
      <div className="flex items-center justify-between font-semibold text-slate-800 mb-2 px-1 gap-1">
        <AppIconButton icon="⇦" title="Previous Month" onClick={handlePrevMonth} />
        
        <div className="flex items-center gap-1.5">
          <select
            value={monthIndex}
            onChange={handleMonthSelect}
            className="bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            {months.map((m, idx) => (
              <option key={m} value={idx}>{m}</option>
            ))}
          </select>

          <select
            value={year}
            onChange={handleYearSelect}
            className="bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <AppIconButton icon="⇨" title="Next Month" onClick={handleNextMonth} />
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 text-center font-medium text-slate-400 mb-1">
        {daysOfWeek.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      {/* Date Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {paddingSlots.map((p) => (
          <div key={`pad-${p}`} className="py-1" />
        ))}
        {daysInMonth.map((day) => {
          const isSelected = day === activeDay;
          return (
            <button
              key={day}
              type="button"
              onClick={() => handleDateClick(day)}
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

      {/* Selected Date Output */}
      <div className="mt-3 pt-2 border-t border-slate-100 text-slate-500 text-[11px]">
        Selected: <span className="font-semibold text-indigo-600">{formattedSelected}</span>
      </div>
    </div>
  );
};