import React, { ChangeEvent, HTMLAttributes } from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface AppSliderProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  value?: number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export const AppSlider: React.FC<AppSliderProps> = ({ 
  label, 
  value = 0, 
  onChange, 
  min = 0, 
  max = 120, 
  step = 10,
  className = '',
  ...props 
}) => {
  const { theme } = useTheme();
  const ticks: number[] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

  if (theme === 'windows') {
    return (
      <div className={`font-sans text-[11px] select-none bg-[#D4D0C8] ${className}`} {...props}>
        {label && (
          <div className="text-black font-normal mb-0.5">
            {label}: <span className="font-bold">{value}</span>
          </div>
        )}
        <div className="relative w-full">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full accent-[#000080] cursor-pointer h-4 bg-transparent"
          />
          {/* JSlider Tick Lines & Labels */}
          <div className="flex justify-between text-[9px] text-black px-1.5 -mt-1">
            {ticks.map((t) => (
              <div key={t} className="flex flex-col items-center min-w-[12px]">
                <span className="h-1.5 w-[1px] bg-[#404040] mb-0.5" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Modern Theme
  return (
    <div className={`space-y-1 ${className}`} {...props}>
      {label && (
        <div className="flex justify-between text-xs font-medium text-slate-700">
          <span>{label}</span>
          <span className="font-semibold text-indigo-600">{value}</span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full accent-indigo-600 cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>{min}</span>
        <span>{max / 2}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};