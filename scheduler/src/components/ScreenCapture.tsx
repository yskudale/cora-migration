import { useState, useEffect } from 'react';
import type { ScreeningPatient } from '../types';
import { scanningService } from '../services/scanningService';
import { LoadingSpinner, TBDBadge } from './Shared';
import { ScanIcon, StethoscopeIcon, CheckCircleIcon, XCircleIcon } from './Icons';

type ScanState = 'idle' | 'scanning' | 'success' | 'error';

export function ScreenCapture() {
  const [patient, setPatient] = useState<ScreeningPatient | null>(null);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState('');
  const [state, setState] = useState<ScanState>('idle');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setLoading(true);
    scanningService.getScreeningPatient('PSC-2026-0089').then((data) => {
      setPatient(data);
      setDescription(data.description);
      setLoading(false);
    });
  }, []);

  // AS-IS: PreScreen.java calls DMScanning.saveScreenScan(pscno) directly
  // — NOT ScanDialog. Minimal view: description field + Scan button only.
  // No document list, no toolbar, no status panel.

  const handleScan = async () => {
    setState('scanning');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 10, 90));
    }, 250);

    await new Promise((r) => setTimeout(r, 1500));

    clearInterval(interval);
    setProgress(100);
    setState('success');
  };

  const handleReset = () => {
    setState('idle');
    setProgress(0);
  };

  if (loading) return <LoadingSpinner label="Loading screening patient..." />;

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-neutral-800">Screening Scan</h2>
        <p className="text-sm text-neutral-500">
          Minimal capture view — description and scan only. No document list or toolbar.
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <StethoscopeIcon size={18} className="text-primary-600" />
              <h3 className="text-sm font-semibold text-neutral-700">Screening Capture</h3>
            </div>
            <span className="badge-primary">SCREEN</span>
          </div>

          <div className="card-body space-y-4">
            {patient && (
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-neutral-400">Patient</p>
                    <p className="text-sm font-medium text-neutral-700">{patient.patientName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400">Patient ID</p>
                    <p className="text-sm text-neutral-700">{patient.patientId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400">Screening ID (PSCNO)</p>
                    <p className="text-sm text-neutral-700">{patient.pscno}</p>
                  </div>
                </div>
              </div>
            )}

            {state === 'idle' && (
              <>
                <div>
                  <label className="label">Description</label>
                  <input
                    className="input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter screening description..."
                  />
                </div>

                <button className="btn-primary w-full" onClick={handleScan}>
                  <ScanIcon size={18} /> Scan
                </button>
              </>
            )}

            {state === 'scanning' && (
              <div className="space-y-6 py-4">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
                  <p className="text-sm font-medium text-neutral-700">Scanning...</p>
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
                  <p className="text-sm font-medium text-neutral-700">Screening scan saved</p>
                  <p className="text-xs text-neutral-400">Document saved for {patient?.patientName}</p>
                </div>
                <button className="btn-secondary w-full" onClick={handleReset}>
                  Scan Another
                </button>
              </div>
            )}

            {state === 'error' && (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-3 py-4">
                  <XCircleIcon size={48} className="text-error-500" />
                  <p className="text-sm font-medium text-neutral-700">Scan failed</p>
                  <p className="text-xs text-neutral-400">Please check the scanner and try again.</p>
                </div>
                <button className="btn-secondary w-full" onClick={handleReset}>
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3">
          <TBDBadge label="AS-IS Parity" />
          <p className="text-xs text-neutral-500">
            Legacy PreScreen.java calls DMScanning.saveScreenScan(pscno) directly —
            no ScanDialog, no document list, no toolbar. This minimal view preserves that behavior.
          </p>
        </div>
      </div>
    </div>
  );
}
