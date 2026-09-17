import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const AppDataTable = ({ headers, data, selectedIndex = 0, onSelectRow }) => {
  const { theme } = useTheme();

  if (theme === 'windows') {
    return (
      <div className="bg-white border-2 border-t-[#7F9DB9] border-l-[#7F9DB9] border-b-white border-r-white overflow-auto max-h-[160px] h-36">
        <table className="w-full border-collapse font-sans text-[11px] text-black select-none">
          <thead>
            <tr className="bg-[#F0EEEF]">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="border-t border-l border-white border-r border-b border-b-[#808080] border-r-[#808080] bg-[#F0EEEF] px-2 py-0.5 text-left font-normal shadow-[inset_1px_1px_0px_#ffffff]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => {
              const isSelected = rowIndex === selectedIndex;
              return (
                <tr
                  key={rowIndex}
                  onClick={() => onSelectRow && onSelectRow(rowIndex)}
                  className={`cursor-pointer ${isSelected ? 'bg-[#0078D7] text-white' : 'hover:bg-slate-100 text-black'}`}
                >
                  {Object.values(row).map((val, cellIndex) => (
                    <td key={cellIndex} className="border-r border-b border-[#D4D0C8] px-2 py-0.5 whitespace-nowrap">
                      {val}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs">
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onSelectRow && onSelectRow(rowIndex)}
              className={`cursor-pointer transition-colors ${rowIndex === selectedIndex ? 'bg-indigo-50 font-medium text-indigo-900' : 'hover:bg-slate-50'}`}
            >
              {Object.values(row).map((val, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 whitespace-nowrap">{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};