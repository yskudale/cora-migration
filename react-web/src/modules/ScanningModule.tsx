import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { AppModal } from '../components/Layout/AppModal';
import { AppButton } from '../components/Button/AppButton';
import { AppFieldset } from '../components/Layout/AppFieldset';
import { AppDataTable } from '../components/DataDisplay/AppDataTable';
import { useTheme } from '../context/ThemeContext';

export interface ScanningModuleProps {
  onClose: () => void;
}

export interface ExtractedDocumentDetails {
  invoice: string;
  date: string;
  vendor: string;
  amount: string;
  orderNumber: string;
  item: string;
}

interface UploadedDocument {
  type: string;
  notes: string;
  date: string;
  by: string;
  status: string;
  extractedDetails?: ExtractedDocumentDetails;
}

const DOCUMENTS_STORAGE_KEY = 'cora-scanning-documents';
const SELECTED_DOCUMENT_STORAGE_KEY = 'cora-selected-document-index';
const initialDocuments: UploadedDocument[] = [
  { type: 'Misc', notes: 'Imported File: 123.pdf', date: '09/15/2026', by: 'McConkey, Reec', status: 'Active' },
];

const loadStoredDocuments = (): UploadedDocument[] => {
  try {
    const storedDocuments = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
    if (!storedDocuments) return initialDocuments;

    const parsedDocuments: unknown = JSON.parse(storedDocuments);
    if (!Array.isArray(parsedDocuments)) return initialDocuments;

    return parsedDocuments.map((document) => {
      const typedDocument = document as Partial<UploadedDocument>;
      return {
        type: typedDocument.type ?? 'Misc',
        notes: typedDocument.notes ?? 'Imported File',
        date: typedDocument.date ?? new Date().toLocaleDateString('en-US'),
        by: typedDocument.by ?? 'Current User',
        status: typedDocument.status ?? 'Active',
        extractedDetails: typedDocument.extractedDetails,
      };
    });
  } catch {
    return initialDocuments;
  }
};

const loadStoredSelectedDocument = () => {
  const storedIndex = Number(localStorage.getItem(SELECTED_DOCUMENT_STORAGE_KEY));
  return Number.isInteger(storedIndex) && storedIndex >= 0 ? storedIndex : 0;
};

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const extractValue = (text: string, patterns: RegExp[]) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]?.trim()) return match[1].trim();
  }
  return 'Not found';
};

const parseDocumentText = (text: string): ExtractedDocumentDetails => {
  const normalizedText = text.replace(/\u00a0/g, ' ').replace(/[ \t]+/g, ' ');
  const lineItem = extractValue(normalizedText, [
    /Description\s+([\s\S]*?)(?=HSN\s*:\s*\S+)/i,
    /(?:Item|Product|Service)\s*(?:Description)?\s*:\s*([^\n]+)/i,
  ]).replace(/\s+/g, ' ').trim();

  return {
    invoice: extractValue(normalizedText, [
        /Invoice\s+Number\s*:\s*([^\n]+)/i,
        /(?:Document|Reference)\s+(?:Number|No\.?|ID)\s*:\s*([^\n]+)/i,
      ]),
    date: extractValue(normalizedText, [
        /Invoice\s+Date\s*:\s*([^\n]+)/i,
        /(?:Document|Issue|Order)\s+Date\s*:\s*([^\n]+)/i,
        /Date\s*:\s*([^\n]+)/i,
      ]),
    vendor: extractValue(normalizedText, [
        /Sold\s+By\s*:\s*([^\n]+)/i,
        /(?:Vendor|Sender|From|Provider)\s*:\s*([^\n]+)/i,
      ]),
    amount: extractValue(normalizedText, [
        /Invoice\s+Value\s*:\s*([^\n]+)/i,
        /Total\s+Amount\s*:\s*([^\n]+)/i,
        /TOTAL\s*:\s*[^\n]*?([₹$€£]?\s?[\d,]+(?:\.\d{2})?)/i,
      ]),
    orderNumber: extractValue(normalizedText, [
        /Order\s+Number\s*:\s*([^\n]+)/i,
        /Order\s+(?:No\.?|ID)\s*:\s*([^\n]+)/i,
      ]),
    item: lineItem,
  };
};

const extractPdfDetails = async (file: File): Promise<ExtractedDocumentDetails> => {
  const document = await pdfjsLib.getDocument({
    data: await file.arrayBuffer(),
  }).promise;
  const pageTexts: string[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    pageTexts.push(content.items
      .map((item) => ('str' in item ? item.str : ''))
      .filter(Boolean)
      .join('\n'));
  }

  const text = pageTexts.join('\n');
  if (!text.trim()) {
    throw new Error('No selectable text was found. Scanned image PDFs require OCR before they can be parsed.');
  }
  return parseDocumentText(text);
};

export const ScanningModule = ({ onClose }: ScanningModuleProps) => {
  const { theme } = useTheme();
  const [selectedOption, setSelectedOption] = useState('ABN Form Option 1');
  const [selectedDocIndex, setSelectedDocIndex] = useState(loadStoredSelectedDocument);
  const [selectedFileType, setSelectedFileType] = useState('ABN Form Option 1');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [scanError, setScanError] = useState('');
  const [documents, setDocuments] = useState<UploadedDocument[]>(loadStoredDocuments);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState('');
  const [emailModalPosition, setEmailModalPosition] = useState({ x: 260, y: 140 });
  const emailDragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));
    } catch { }
  }, [documents]);

  useEffect(() => {
    try {
      localStorage.setItem(SELECTED_DOCUMENT_STORAGE_KEY, String(selectedDocIndex));
    } catch { }
  }, [selectedDocIndex]);

  const documentHeaders = ['Type', 'Notes', 'Date Added', 'By', 'Status'];
  const selectedDocument = documents[selectedDocIndex];
  const extractedDetails = selectedDocument?.extractedDetails;

  const handleMarkDocumentAsDisputed = () => {
    setDocuments((currentDocuments) => currentDocuments.map((document, index) => (
      index === selectedDocIndex ? { ...document, status: 'Disputed' } : document
    )));
  };

  const handleOpenEmailModal = () => {
    setIsEmailModalOpen(true);
    setEmailRecipients('');
  };

  const handleEmailDragStart = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('input, textarea, button')) return;

    emailDragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: emailModalPosition.x,
      originY: emailModalPosition.y,
    };
  };

  useEffect(() => {
    if (!isEmailModalOpen) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!emailDragRef.current) return;

      const deltaX = event.clientX - emailDragRef.current.startX;
      const deltaY = event.clientY - emailDragRef.current.startY;
      setEmailModalPosition({
        x: emailDragRef.current.originX + deltaX,
        y: emailDragRef.current.originY + deltaY,
      });
    };

    const handleMouseUp = () => {
      emailDragRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isEmailModalOpen, emailModalPosition.x, emailModalPosition.y]);

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

    const uploadedFile = selectedFile;
    setIsUploading(true);
    setUploadError('');
    setScanError('');

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
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

      const uploadedDocumentIndex = documents.length;
      setDocuments((currentDocuments) => [
        ...currentDocuments,
        {
          type: selectedFileType,
          notes: `${uploadedFile.name} (${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)`,
          date: new Date().toLocaleDateString('en-US'),
          by: 'Current User',
          status: 'Active',
          extractedDetails: undefined,
        },
      ]);
      setSelectedDocIndex(uploadedDocumentIndex);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setIsUploadOpen(false);

      setIsScanning(true);
      try {
        const parsedDetails = await extractPdfDetails(uploadedFile);
        setDocuments((currentDocuments) => currentDocuments.map((document, index) => (
          index === uploadedDocumentIndex
            ? { ...document, status: 'Active', extractedDetails: parsedDetails }
            : document
        )));
      } catch (error) {
        setDocuments((currentDocuments) => currentDocuments.map((document, index) => (
          index === uploadedDocumentIndex
            ? { ...document, status: 'Active', extractedDetails: undefined }
            : document
        )));
        setScanError(error instanceof Error ? error.message : 'The PDF could not be parsed.');
      } finally {
        setIsScanning(false);
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'The document could not be stored.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <AppModal title="E-Docs for Patient #1612403 : RefstatTest7, Brandon" onClose={onClose}>
        <div className="space-y-3 font-sans text-xs">
          
          {/* Top Fieldset: Document List + Actions */}
          <AppFieldset legend="Scan Uploaded files">
            <div className="space-y-2 pt-1">
              <AppDataTable
                headers={documentHeaders}
                data={documents}
                selectedIndex={selectedDocIndex}
                onSelectRow={(idx) => {
                  setSelectedDocIndex(idx);
                  setScanError('');
                }}
                contextMenuItems={[
                  { id: 'view_row', label: 'View', onClick: () => alert('View document') },
                  { id: 'email_row', label: 'Email', onClick: handleOpenEmailModal },
                  { id: 'edit_row', label: 'Edit', onClick: () => alert('Edit document') },
                  { id: 'mark_dispute', label: 'Mark as Disputed', onClick: handleMarkDocumentAsDisputed },
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

          <AppFieldset legend="Extracted Document Details">
            {isScanning && (
              <div className="flex items-center gap-2 py-2 text-blue-700" role="status" aria-live="polite">
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700" />
                <span>Scanning PDF and extracting document details...</span>
              </div>
            )}
            {scanError && <p className="py-1 text-red-700 text-[11px]" role="alert">{scanError}</p>}
            {!isScanning && !scanError && !extractedDetails && (
              <p className={theme === 'windows' ? 'py-1 text-[#808080]' : 'py-1 text-slate-400'}>
                Upload a PDF to display extracted details.
              </p>
            )}
            {extractedDetails && (
              <div className={`max-h-48 overflow-y-auto border ${theme === 'windows' ? 'border-[#7F9DB9] bg-white' : 'border-slate-200 rounded-lg bg-white'}`}>
                <table className={`w-full text-left ${theme === 'windows' ? 'text-[11px] text-black' : 'text-xs text-slate-700'}`}>
                  <thead>
                    <tr className={theme === 'windows' ? 'bg-[#F0EEEF] border-b border-[#808080]' : 'bg-slate-100 border-b border-slate-200'}>
                      <th className="p-1 font-semibold">Invoice</th>
                      <th className="p-1 font-semibold">Date</th>
                      <th className="p-1 font-semibold">Vendore</th>
                      <th className="p-1 font-semibold">Amount</th>
                      <th className="p-1 font-semibold">Order No</th>
                      <th className="p-1 font-semibold">Iteam</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={theme === 'windows' ? 'border-b border-[#e0e0e0]' : 'border-b border-slate-100'}>
                      <td className="p-1 whitespace-pre-wrap break-words">{extractedDetails.invoice}</td>
                      <td className="p-1 whitespace-pre-wrap break-words">{extractedDetails.date}</td>
                      <td className="p-1 whitespace-pre-wrap break-words">{extractedDetails.vendor}</td>
                      <td className="p-1 whitespace-pre-wrap break-words">{extractedDetails.amount}</td>
                      <td className="p-1 whitespace-pre-wrap break-words">{extractedDetails.orderNumber}</td>
                      <td className="p-1 whitespace-pre-wrap break-words">{extractedDetails.item}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </AppFieldset>
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

      {isEmailModalOpen && (
        <div
          style={{
            position: 'fixed',
            left: `${emailModalPosition.x}px`,
            top: `${emailModalPosition.y}px`,
            width: '320px',
            zIndex: 1000,
          }}
          className={theme === 'windows'
            ? 'border-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] bg-[#F0EEEF] shadow-[2px_2px_0px_rgba(0,0,0,0.25)]'
            : 'border border-slate-200 bg-white shadow-xl rounded-lg'}
        >
          <div
            className={theme === 'windows'
              ? 'flex cursor-move items-center justify-between border-b border-[#808080] bg-[#F0EEEF] px-2 py-1 text-[12px] font-medium text-black'
              : 'flex cursor-move items-center justify-between border-b border-slate-200 bg-slate-50 px-2 py-1 text-[12px] font-medium text-slate-800 rounded-t-lg'}
            onMouseDown={handleEmailDragStart}
          >
            <span>Enter Address</span>
            <button
              type="button"
              onClick={() => setIsEmailModalOpen(false)}
              className={theme === 'windows'
                ? 'px-1 text-[16px] leading-none text-black hover:bg-[#d7d7d7]'
                : 'px-1 text-[16px] leading-none text-slate-500 hover:bg-slate-200 rounded'}
              aria-label="Close email modal"
            >
              ×
            </button>
          </div>

          <div className={theme === 'windows' ? 'p-2 bg-[#F0EEEF]' : 'p-2 bg-white'}>
            <label className={theme === 'windows' ? 'mb-1 block text-[11px] text-black' : 'mb-1 block text-[11px] text-slate-700'}>
              Recipient Email
            </label>
            <input
              type="email"
              value={emailRecipients}
              onChange={(event) => setEmailRecipients(event.target.value)}
              placeholder="name@example.com"
              className={theme === 'windows'
                ? 'h-8 w-full border border-[#7f9db9] bg-white p-1 text-[11px] text-black outline-none'
                : 'h-8 w-full rounded border border-slate-300 bg-white p-1 text-[11px] text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500'}
            />

            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className={theme === 'windows'
                  ? 'border border-[#7a7a7a] bg-[#efefef] px-2 py-1 text-[11px] text-black hover:bg-[#e3e3e3]'
                  : 'border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-700 rounded hover:bg-slate-50'}
              >
                OK
              </button>
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className={theme === 'windows'
                  ? 'border border-[#7a7a7a] bg-[#efefef] px-2 py-1 text-[11px] text-black hover:bg-[#e3e3e3]'
                  : 'border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-700 rounded hover:bg-slate-50'}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};