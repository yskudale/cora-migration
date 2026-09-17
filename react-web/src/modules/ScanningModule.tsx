import React, { useState } from 'react';
import { AppModal } from '../components/Layout/AppModal';
import { AppButton } from '../components/Button/AppButton';
import { AppFieldset } from '../components/Layout/AppFieldset';
import { AppDataTable } from '../components/AppDataTable1';
import { useTheme } from '../context/ThemeContext';

export const ScanningModule = ({ onClose }) => {
  const { theme } = useTheme();
  const [selectedOption, setSelectedOption] = useState('ABN Form Option 1');
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);

  const documentHeaders = ['Type', 'Notes', 'Date Added', 'By'];
  const documents = [
    { type: 'Misc', notes: 'Imported File: 123.pdf', date: '09/15/2026', by: 'McConkey, Reec' }
  ];

  const statusItems = [
    { name: 'FCE', date: 'N/A' },
    { name: 'Florida PIP Forms', date: 'N/A' },
    { name: 'Insurance Card', date: 'N/A' },
    { name: 'Letter of Protection', date: 'N/A' },
    { name: 'Medical Record Reque...', date: 'N/A' },
    { name: 'Misc', date: '09/15/2026' },
    { name: 'Other Therapy Notes', date: 'N/A' },
    { name: 'Patient Intake Forms', date: 'N/A' },
    { name: 'Payment Agreement', date: 'N/A' },
    { name: 'RX', date: 'N/A' },
    { name: 'Signed Plan Of Care', date: 'N/A' },
    { name: 'State Issued ID - Back', date: 'N/A' },
    { name: 'State Issued ID - Front', date: 'N/A' }
  ];

  return (
    <AppModal title="E-Docs for Patient #1612403 : RefstatTest7, Brandon" onClose={onClose}>
      <div className="space-y-3 font-sans text-xs">
        
        {/* Top Fieldset: Document List + Actions */}
        <AppFieldset legend="Right click to view, email or print">
          <div className="space-y-2 pt-1">
            <AppDataTable
              headers={documentHeaders}
              data={documents}
              selectedIndex={selectedDocIndex}
              onSelectRow={(idx) => setSelectedDocIndex(idx)}
            />

            <div className="flex gap-2 justify-between pt-1">
              <div className="flex gap-2">
                <AppButton onClick={() => alert("File All clicked")}>File All</AppButton>
                <AppButton onClick={() => alert("Print All clicked")}>Print All</AppButton>
                <AppButton onClick={() => alert("View All clicked")}>View All</AppButton>
              </div>
              <AppButton onClick={() => alert("Upload File clicked")}>Upload File</AppButton>
            </div>
          </div>
        </AppFieldset>

        {/* Bottom Split Grid: Scan Status & Scanning Options */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Scan Status Fieldset */}
          <AppFieldset legend="Scan Status">
            <div className={`h-48 overflow-y-auto p-1 bg-white border ${theme === 'windows' ? 'border-[#7F9DB9]' : 'border-slate-200 rounded-lg'}`}>
              <table className="w-full text-[11px] select-none">
                <tbody>
                  {statusItems.map((item, idx) => {
                    const isNA = item.date === 'N/A';
                    return (
                      <tr key={idx} className="hover:bg-slate-100">
                        <td className={`p-0.5 ${theme === 'windows' ? (isNA ? 'text-[#C00000]' : 'text-black') : 'text-slate-700'}`}>
                          {item.name}
                        </td>
                        <td className={`p-0.5 text-right font-medium ${isNA ? 'text-[#C00000]' : (theme === 'windows' ? 'text-[#0078D7]' : 'text-emerald-600')}`}>
                          {item.date}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </AppFieldset>

          {/* Scanning Options Fieldset */}
          <AppFieldset legend="Scanning Options">
            <div className="space-y-3 pt-1">
              <div className="flex gap-2 items-center">
                <select 
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className={theme === 'windows' 
                    ? 'border-2 border-t-[#7F9DB9] border-l-[#7F9DB9] border-b-white border-r-white bg-white text-[11px] p-1 flex-1 outline-none' 
                    : 'border border-slate-300 rounded-lg text-xs p-2 flex-1 bg-white focus:ring-2 focus:ring-indigo-500 outline-none'}
                >
                  <option value="ABN Form Option 1">ABN Form Option 1</option>
                  <option value="Insurance Card Option 2">Insurance Card Option 2</option>
                  <option value="Intake Form Option 3">Intake Form Option 3</option>
                </select>
                <AppButton onClick={() => alert(`Scanning: ${selectedOption}`)}>Scan</AppButton>
              </div>

              {/* Inset Recessed Preview Box */}
              <div className={`h-32 bg-white flex items-center justify-center text-slate-400 text-xs ${
                theme === 'windows' 
                  ? 'border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white' 
                  : 'border border-slate-200 rounded-lg bg-slate-50 shadow-inner'
              }`}>
                [ Document Preview Window ]
              </div>
            </div>
          </AppFieldset>

        </div>
      </div>
    </AppModal>
  );
};