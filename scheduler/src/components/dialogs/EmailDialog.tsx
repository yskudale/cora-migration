import { useState } from 'react';
import type { ScannedDocument } from '../../types';
import { Modal } from '../Modal';
import { AuditIndicator } from '../Shared';
import { MailIcon, CheckCircleIcon, XCircleIcon, LoaderIcon } from '../Icons';

interface EmailDialogProps {
  open: boolean;
  onClose: () => void;
  document: ScannedDocument | null;
  onSuccess: () => void;
}

export function EmailDialog({ open, onClose, document, onSuccess }: EmailDialogProps) {
  const [recipient, setRecipient] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  if (!document) return null;

  const handleSend = async () => {
    setState('sending');
    await new Promise((r) => setTimeout(r, 1000));
    setState('success');
  };

  const handleClose = () => {
    setState('idle');
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
      title="Email Document"
      subtitle={`${document.categoryLabel} — ${document.description}`}
      icon={<MailIcon size={20} />}
      size="sm"
      footer={
        state === 'idle' ? (
          <>
            <button className="btn-secondary" onClick={handleClose}>Cancel</button>
            <button className="btn-primary" onClick={handleSend} disabled={!recipient}>
              <MailIcon size={16} /> Send
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
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
            <p className="text-xs font-medium text-neutral-500">Document</p>
            <p className="text-sm text-neutral-700">{document.description}</p>
            <p className="text-xs text-neutral-400 mt-1">
              {document.pageCount} page(s) · {document.categoryLabel}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <AuditIndicator action="Email action will be logged to EDOCHIST" />
          </div>
        </div>
      )}

      {state === 'sending' && (
        <div className="flex flex-col items-center gap-3 py-8">
          <LoaderIcon size={32} className="text-primary-600" />
          <p className="text-sm font-medium text-neutral-700">Sending email...</p>
        </div>
      )}

      {state === 'success' && (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3 py-6">
            <CheckCircleIcon size={48} className="text-success-500" />
            <p className="text-sm font-medium text-neutral-700">Email sent successfully</p>
            <p className="text-xs text-neutral-400">To: {recipient}</p>
          </div>
          <AuditIndicator action={`Email logged to EDOCHIST at ${new Date().toLocaleTimeString()}`} />
        </div>
      )}

      {state === 'error' && (
        <div className="flex flex-col items-center gap-3 py-6">
          <XCircleIcon size={48} className="text-error-500" />
          <p className="text-sm font-medium text-neutral-700">Email failed to send</p>
          <p className="text-xs text-neutral-400">Please check the recipient address and try again.</p>
        </div>
      )}
    </Modal>
  );
}
