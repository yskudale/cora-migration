import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const AppGroupBox = ({ title, children, titleColor = '#000', borderColor = '#7F9DB9' }) => {
  const { theme } = useTheme();

  // Windows Classic Style (Fieldset / Legend Box)
  if (theme === 'windows') {
    return (
      <fieldset style={{
        border: `1px solid ${borderColor}`,
        borderRadius: '0px',
        padding: '8px',
        margin: '0',
        fontFamily: 'Tahoma, sans-serif',
        fontSize: '11px',
        backgroundColor: '#ECE9D8'
      }}>
        <legend style={{ color: titleColor, padding: '0 4px', fontWeight: 'normal' }}>
          {title}
        </legend>
        {children}
      </fieldset>
    );
  }

  // Modern Tailwind Style
  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm flex flex-col h-full">
      <h4 className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wider">
        {title}
      </h4>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};