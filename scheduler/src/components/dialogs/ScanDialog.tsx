import { useState } from 'react';
import type { ScanContextType } from '../../types';
import { Modal } from '../Modal';
import { TBDNote } from '../Shared';

import { ScanIcon, CheckCircleIcon, XCircleIcon } from '../Icons';

interface ScanDialogProps {
  open: boolean;
  onClose: () => void;
  contextType: ScanContextType;
  onSuccess: () => void;
}

type ScanState = 'idle' | 'scanning' | 'success' | 'error' | 'no_scanner';

export function ScanDialog({ open, onClose, contextType, onSuccess }: ScanDialogProps) {
  const [state, setState] = useState<ScanState>('idle');
  const [progress, setProgress] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [description, setDescription] = useState('');

  const handleScan = async () => {
    setState('scanning');
    setProgress(0);
    setPageCount(0);

    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 10, 90));
      setPageCount((c) => (c < 3 ? c + 1 : c));
    }, 300);

    const result = await scanningServiceMock();

    clearInterval(interval);
    setProgress(100);

    if (result.success) {
      setState('success');
      setPageCount(result.pageCount);
    } else {
      setState('error');
    }
  };

  const scanningServiceMock = () => {
    return new Promise<{ success: boolean; pageCount: number }>((resolve) => {
      setTimeout(() => resolve({ success: true, pageCount: 3 }), 2000);
    });
  };

  const handleClose = () => {
    setState('idle');
    setProgress(0);
    setPageCount(0);
    setDescription('');
    onClose();
  };

  const handleSave = () => {
    onSuccess();
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Physical Scan"
      subtitle={`Context: ${contextType} — Dynamsoft Web TWAIN SDK`}
      icon={<ScanIcon size={20} />}
      size="md"
      footer={
        state === 'success' ? (
          <>
            <button className="btn-secondary" onClick={handleClose}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>Save Document</button>
          </>
        ) : state === 'error' ? (
          <button className="btn-secondary" onClick={() => setState('idle')}>Try Again</button>
        ) : null
      }
    >
      {state === 'idle' && (
        <div className="space-y-4">
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-sm font-medium text-neutral-700">Scanner Status</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-success-500" />
              <span className="text-sm text-neutral-600">Dynamsoft service detected</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-neutral-300" />
              <span className="text-sm text-neutral-400">Scanner availability / compatibility — TBD</span>
            </div>
          </div>

          <div>
            <label className="label">Description (optional)</label>
            <input
              className="input"
              placeholder="e.g., Photo ID — Front"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Document Category</label>
            <select className="select">
              <option>Select category...</option>
              <option>Photo ID</option>
              <option>Insurance Card</option>
              <option>Referral</option>
              <option>Other</option>
            </select>
          </div>

          <TBDNote>
            Scanner hardware compatibility with Dynamsoft (TWAIN requirement) is not confirmed.
            Supported scanner models are TBD.
          </TBDNote>

          <button className="btn-primary w-full" onClick={handleScan}>
            <ScanIcon size={18} /> Start Scan
          </button>
        </div>
      )}

      {state === 'scanning' && (
        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
              <ScanIcon size={24} className="absolute inset-0 m-auto text-primary-600" />
            </div>
            <p className="text-sm font-medium text-neutral-700">Scanning in progress...</p>
            <p className="text-xs text-neutral-400">{pageCount} page(s) detected</p>
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
            <p className="text-sm font-medium text-neutral-700">Scan complete</p>
            <p className="text-xs text-neutral-400">{pageCount} page(s) captured successfully</p>
          </div>

          {/* Preview placeholder */}
          <div className="rounded-lg border-2 border-dashed border-neutral-200 bg-neutral-50 p-8">
            <div className="flex items-center justify-center">
              <div className="space-y-1.5">
                {[...Array(pageCount)].map((_, i) => (
                  <div
                    key={i}
                    className="h-24 w-40 rounded border border-neutral-200 bg-white shadow-sm"
                    style={{ marginLeft: i * 8 }}
                  >
                    <div className="flex h-full items-center justify-center">
                      <span className="text-xs text-neutral-300">Page {i + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-neutral-400">Document preview</p>
          </div>

          {description && (
            <div>
              <p className="text-xs font-medium text-neutral-500">Description</p>
              <p className="text-sm text-neutral-700">{description}</p>
            </div>
          )}
        </div>
      )}

      {state === 'error' && (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3 py-4">
            <XCircleIcon size={48} className="text-error-500" />
            <p className="text-sm font-medium text-neutral-700">Scan failed</p>
            <p className="text-xs text-neutral-400">The scanner did not complete the scan. Please check the device and try again.</p>
          </div>
          <TBDNote>
            Error response standard (envelope shape) is TBD — Architecture decision (OC-3).
          </TBDNote>
        </div>
      )}

      {state === 'no_scanner' && (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3 py-4">
            <XCircleIcon size={48} className="text-warning-500" />
            <p className="text-sm font-medium text-neutral-700">Scanner not available</p>
            <p className="text-xs text-neutral-400">
              The Dynamsoft service was not detected on this workstation.
              You can still upload files using the Upload button.
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}
