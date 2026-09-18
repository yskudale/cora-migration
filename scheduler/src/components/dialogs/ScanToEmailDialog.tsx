import { useState } from 'react';
import { Modal } from '../Modal';
import { TBDBadge, TBDNote } from '../Shared';
import { MailIcon, ScanIcon, CheckCircleIcon, XCircleIcon } from '../Icons';

interface ScanToEmailDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type State = 'idle' | 'scanning' | 'success' | 'error';

export function ScanToEmailDialog({ open, onClose, onSuccess }: ScanToEmailDialogProps) {
  const [recipient, setRecipient] = useState('');
  const [state, setState] = useState<State>('idle');
  const [progress, setProgress] = useState(0);

  // AS-IS Legacy: scanOnlyNoDB(1, "COLOR")
  // - sides = 1 (hardcoded)
  // - colorMode = "COLOR" (hardcoded)
  // - No patient/clinic context
  // - No permission gate
  // - No document record created
  //
  // PROPOSED (NOT CONFIRMED): User-selectable sides and color mode
  // The PRD adds these controls but they are NOT approved — TBD Client confirmation

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

  const handleClose = () => {
    setState('idle');
    setProgress(0);
    setRecipient('');
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
      title="Scan to Email"
      subtitle="Scan a document and email it — no document record is created"
      icon={<MailIcon size={20} />}
      size="md"
      footer={
        state === 'idle' ? (
          <>
            <button className="btn-secondary" onClick={handleClose}>Cancel</button>
            <button className="btn-primary" onClick={handleScan} disabled={!recipient}>
              <ScanIcon size={16} /> Scan & Send
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
          <div>
            <label className="label">Recipient Email Address</label>
            <input
              className="input"
              type="email"
              placeholder="recipient@example.com"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          {/* PROPOSED controls — NOT confirmed */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">
                Sides
                <span className="ml-2"><TBDBadge label="TBD" /></span>
              </label>
              <select className="select" defaultValue="1" disabled>
                <option value="1">1 (Single-sided)</option>
                <option value="2">2 (Double-sided)</option>
              </select>
            </div>
            <div>
              <label className="label">
                Color Mode
                <span className="ml-2"><TBDBadge label="TBD" /></span>
              </label>
              <select className="select" defaultValue="COLOR" disabled>
                <option value="COLOR">Color</option>
                <option value="GRAYSCALE">Grayscale</option>
              </select>
            </div>
          </div>

          <TBDNote>
            Legacy behavior hardcodes sides=1 and color=COLOR.
            User-selectable sides and color mode are proposed but NOT confirmed.
            Controls are shown disabled pending client approval.
          </TBDNote>

          <div className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2">
            <p className="text-xs text-neutral-400">
              This action scans a document and emails it directly.
              No document record is created in the patient's file.
            </p>
          </div>
        </div>
      )}

      {state === 'scanning' && (
        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-3">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
            <p className="text-sm font-medium text-neutral-700">Scanning and sending...</p>
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
            <p className="text-sm font-medium text-neutral-700">Scan sent to email</p>
            <p className="text-xs text-neutral-400">Delivered to: {recipient}</p>
          </div>
          <div className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2">
            <p className="text-xs text-neutral-400">
              No document record was created. This was a scan-to-email only.
            </p>
          </div>
        </div>
      )}

      {state === 'error' && (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3 py-4">
            <XCircleIcon size={48} className="text-error-500" />
            <p className="text-sm font-medium text-neutral-700">Scan or email failed</p>
            <p className="text-xs text-neutral-400">Please check the scanner and recipient address, then try again.</p>
          </div>
        </div>
      )}
    </Modal>
  );
}
