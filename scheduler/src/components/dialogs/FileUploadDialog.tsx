import { useState, useRef } from 'react';
import type { ScanContextType, DocumentCategory } from '../../types';
import { Modal } from '../Modal';
import { TBDBadge, TBDNote } from '../Shared';
import { UploadIcon, CheckCircleIcon, XCircleIcon, FileTextIcon } from '../Icons';

interface FileUploadDialogProps {
  open: boolean;
  onClose: () => void;
  contextType: ScanContextType;
  categories: DocumentCategory[];
  onSuccess: () => void;
}

type UploadState = 'idle' | 'selected' | 'uploading' | 'success' | 'error';

export function FileUploadDialog({ open, onClose, contextType, categories, onSuccess }: FileUploadDialogProps) {
  const [state, setState] = useState<UploadState>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<number | ''>('');
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setState('selected');
    }
  };

  const handleUpload = async () => {
    if (!file || !category) return;
    setState('uploading');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 15, 90));
    }, 200);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    clearInterval(interval);
    setProgress(100);
    setState('success');
  };

  const handleClose = () => {
    setState('idle');
    setFile(null);
    setCategory('');
    setProgress(0);
    onClose();
  };

  const handleDone = () => {
    onSuccess();
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="File Upload"
      subtitle={`Context: ${contextType}`}
      icon={<UploadIcon size={20} />}
      size="md"
      footer={
        state === 'selected' ? (
          <>
            <button className="btn-secondary" onClick={handleClose}>Cancel</button>
            <button className="btn-primary" onClick={handleUpload} disabled={!category}>
              <UploadIcon size={16} /> Upload
            </button>
          </>
        ) : state === 'success' ? (
          <button className="btn-primary" onClick={handleDone}>Done</button>
        ) : state === 'error' ? (
          <button className="btn-secondary" onClick={() => setState('idle')}>Try Again</button>
        ) : null
      }
    >
      {state === 'idle' && (
        <div className="space-y-4">
          <div
            className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 px-4 py-10 cursor-pointer transition-colors hover:border-primary-300 hover:bg-primary-50"
            onClick={() => inputRef.current?.click()}
          >
            <UploadIcon size={32} className="text-neutral-400" />
            <p className="text-sm font-medium text-neutral-600">Click to select a file</p>
            <p className="text-xs text-neutral-400">All file types accepted</p>
          </div>
          <input ref={inputRef} type="file" className="hidden" onChange={handleFileSelect} />

          <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2">
            <span className="text-xs text-neutral-500">File size limit</span>
            <TBDBadge label="TBD — Client confirmation" />
          </div>
          <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2">
            <span className="text-xs text-neutral-500">File type validation</span>
            <TBDBadge label="TBD — Client/security confirmation" />
          </div>
        </div>
      )}

      {state === 'selected' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
            <FileTextIcon size={24} className="text-primary-600" />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-neutral-700">{file?.name}</p>
              <p className="text-xs text-neutral-400">{file ? `${(file.size / 1024).toFixed(1)} KB` : ''}</p>
            </div>
            <button className="btn-icon" onClick={() => { setFile(null); setState('idle'); }}>
              <XCircleIcon size={18} />
            </button>
          </div>

          <div>
            <label className="label">Document Category <span className="text-error-500">*</span></label>
            <select
              className="select"
              value={category}
              onChange={(e) => setCategory(Number(e.target.value))}
            >
              <option value="">Select category...</option>
              {categories.map((c) => (
                <option key={c.ecno} value={c.ecno}>{c.label}</option>
              ))}
            </select>
          </div>

          <TBDNote>
            File size limit and file type validation rules are not yet confirmed.
            The prototype accepts all file types and sizes for demonstration purposes.
          </TBDNote>
        </div>
      )}

      {state === 'uploading' && (
        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
            <p className="text-sm font-medium text-neutral-700">Uploading...</p>
          </div>
          <div className="w-full">
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-primary-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1 text-right text-xs text-neutral-400">{progress}%</p>
          </div>
        </div>
      )}

      {state === 'success' && (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3 py-4">
            <CheckCircleIcon size={48} className="text-success-500" />
            <p className="text-sm font-medium text-neutral-700">Upload complete</p>
            <p className="text-xs text-neutral-400">Document has been saved successfully.</p>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
            <p className="text-xs font-medium text-neutral-500">File</p>
            <p className="text-sm text-neutral-700">{file?.name}</p>
          </div>
        </div>
      )}

      {state === 'error' && (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3 py-4">
            <XCircleIcon size={48} className="text-error-500" />
            <p className="text-sm font-medium text-neutral-700">Upload failed</p>
            <p className="text-xs text-neutral-400">The file could not be uploaded. Please try again.</p>
          </div>
        </div>
      )}
    </Modal>
  );
}
