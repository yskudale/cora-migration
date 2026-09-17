import React, { ChangeEvent, useRef, useState } from 'react';
import { AppModal } from '../components/Layout/AppModal';
import { AppButton } from '../components/Button/AppButton';
import { AppFieldset } from '../components/Layout/AppFieldset';
import { AppDataTable } from '../components/DataDisplay/AppDataTable';
import { useTheme } from '../context/ThemeContext';

export interface ScanningModuleProps {
  onClose: () => void;
}

export const ScanningModule = ({ onClose }: ScanningModuleProps) => {
  const { theme } = useTheme();
  const [selectedOption, setSelectedOption] = useState('ABN Form Option 1');
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [selectedFileType, setSelectedFileType] = useState('ABN Form Option 1');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [documents, setDocuments] = useState([
    { type: 'Misc', notes: 'Imported File: 123.pdf', date: '09/15/2026', by: 'McConkey, Reec' }
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentHeaders = ['Type', 'Notes', 'Date Added', 'By'];

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

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Only PDF documents can be uploaded.');
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('The PDF must be 10 MB or smaller.');
      setSelectedFile(null);
      return;
    }

    setUploadError('');
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadError('Select a PDF document first.');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('documentType', selectedFileType);
      formData.append('fileCategory', 'Patient Document');

      const response = await fetch('http://localhost:8080/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || 'The document could not be stored.');
      }

      setDocuments((currentDocuments) => [
        ...currentDocuments,
        {
          type: selectedFileType,
          notes: `${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)`,
          date: new Date().toLocaleDateString('en-US'),
          by: 'Current User',
        },
      ]);
      setSelectedDocIndex(documents.length);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setIsUploadOpen(false);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'The document could not be stored.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AppModal title="E-Docs for Patient #1612403 : RefstatTest7, Brandon" onClose={onClose}>
      <div className="space-y-3 font-sans text-xs">
        
        {/* Top Fieldset: Document List + Actions */}
        <AppFieldset legend="Scan Uploaded files">
          <div className="space-y-2 pt-1">
            <AppDataTable
              headers={documentHeaders}
              data={documents}
              selectedIndex={selectedDocIndex}
              onSelectRow={(idx) => setSelectedDocIndex(idx)}
              contextMenuItems={[
                { id: 'view_row', label: 'View', onClick: () => alert('View document') },
                { id: 'email_row', label: 'Email', onClick: () => alert('Email document') },
                { id: 'edit_row', label: 'Edit', onClick: () => alert('Edit document') },
                { id: 'mark_dispute', label: 'Mark Dispute', onClick: () => alert('Mark Dispute') },
                { id: 'change_scan_type', label: 'Change Scan Type', onClick: () => alert('Change Scan Type') },
              ]}
            />

            <div className="flex gap-2 justify-between pt-1">
              <div className="flex gap-2">
                <AppButton onClick={() => alert("File All clicked")}>File All</AppButton>
                <AppButton onClick={() => alert("Print All clicked")}>Print All</AppButton>
                <AppButton onClick={() => alert("View All clicked")}>View All</AppButton>
              </div>
              <div className="flex items-center gap-2">
                <AppButton onClick={() => setIsUploadOpen(true)}>Upload File</AppButton>
              </div>
            </div>
            {uploadError && <p className="text-red-700 text-[11px]" role="alert">{uploadError}</p>}
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
                  onChange={handleSelectChange}
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
      {isUploadOpen && (
        <AppModal title="File to Import" onClose={() => setIsUploadOpen(false)}>
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <label htmlFor="patient-document-file" className="w-28 shrink-0">File name:</label>
              <input
                ref={fileInputRef}
                id="patient-document-file"
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileSelected}
                className={theme === 'windows'
                  ? 'border-2 border-t-[#7F9DB9] border-l-[#7F9DB9] border-b-white border-r-white bg-white p-1 flex-1'
                  : 'border border-slate-300 rounded-lg p-2 flex-1'}
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="file-category" className="w-28 shrink-0">Files of type:</label>
              <select
                id="file-category"
                defaultValue="Patient Document"
                onChange={() => setUploadError('')}
                className={theme === 'windows'
                  ? 'border-2 border-t-[#7F9DB9] border-l-[#7F9DB9] border-b-white border-r-white bg-white p-1 flex-1'
                  : 'border border-slate-300 rounded-lg p-2 flex-1 bg-white'}
              >
                <option>Patient Document</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="document-type" className="w-28 shrink-0">Document Type:</label>
              <select
                id="document-type"
                value={selectedFileType}
                onChange={(event) => setSelectedFileType(event.target.value)}
                className={theme === 'windows'
                  ? 'border-2 border-t-[#7F9DB9] border-l-[#7F9DB9] border-b-white border-r-white bg-white p-1 flex-1'
                  : 'border border-slate-300 rounded-lg p-2 flex-1 bg-white'}
              >
                <option>ABN Form Option 1</option>
                <option>Insurance Card Option 2</option>
                <option>Intake Form Option 3</option>
              </select>
            </div>
            {selectedFile && <p className="text-slate-600">Selected: {selectedFile.name}</p>}
            {uploadError && <p className="text-red-700" role="alert">{uploadError}</p>}
            {isUploading && (
              <div className="flex items-center gap-2 text-blue-700" role="status" aria-live="polite">
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700" />
                <span>Uploading file... Please wait.</span>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <AppButton onClick={() => setIsUploadOpen(false)} variant="secondary" disabled={isUploading}>Cancel</AppButton>
              <AppButton onClick={handleFileUpload} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Open'}
              </AppButton>
            </div>
          </div>
        </AppModal>
      )}
    </AppModal>
  );
};