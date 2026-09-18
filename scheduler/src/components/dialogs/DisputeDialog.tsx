import { useState } from 'react';
import type { ScannedDocument } from '../../types';
import { Modal } from '../Modal';
import { AlertIcon } from '../Icons';

interface DisputeDialogProps {
  open: boolean;
  onClose: () => void;
  document: ScannedDocument | null;
  onSuccess: () => void;
  onError: (msg: string, detail?: string) => void;
}

export function DisputeDialog({ open, onClose, document: doc, onSuccess, onError }: DisputeDialogProps) {
  const [loading, setLoading] = useState(false);

  if (!doc) return null;

  // AS-IS Business Rules:
  // 1. LOR (ecno=65): Only the original scanner may dispute an LOR document
  // 2. RTM (erecno=32): Cannot dispute when billing charges exist for same date
  const hasLORBlock = doc.isLOR && doc.scannerName !== 'Current User';
  const hasRTMBlock = doc.isRTM;

  const handleConfirm = async () => {
    if (hasLORBlock) {
      onError(
        'Cannot dispute this Letter of Protection',
        'Only the person who originally scanned this LOR document may dispute it.'
      );
      onClose();
      return;
    }

    if (hasRTMBlock) {
      onError(
        'Cannot dispute this RTM document',
        'Billing charges exist for the same date. Remove the charges first.'
      );
      onClose();
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    onSuccess();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Dispute Document"
      icon={<AlertIcon size={20} />}
      size="sm"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="btn-danger"
            onClick={handleConfirm}
            disabled={loading || hasLORBlock || hasRTMBlock}
          >
            {loading ? 'Disputing...' : 'Dispute Document'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning-50">
            <AlertIcon size={20} className="text-warning-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-800">
              Dispute this document?
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              {doc.categoryLabel} — {doc.description}
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              Scanned by {doc.scannerName} on {doc.scanDate}
            </p>
          </div>
        </div>

        {/* LOR Restriction */}
        {hasLORBlock && (
          <div className="flex items-start gap-2 rounded-lg border border-error-200 bg-error-50 px-3 py-2">
            <AlertIcon size={16} className="mt-0.5 shrink-0 text-error-600" />
            <div>
              <p className="text-xs font-medium text-error-800">
                Letter of Protection — Original Scanner Required
              </p>
              <p className="text-xs text-error-700">
                This is a Letter of Protection document. Only the person who originally
                scanned it ({doc.scannerName}) may dispute it. You are not the original scanner.
              </p>
            </div>
          </div>
        )}

        {/* RTM Restriction */}
        {hasRTMBlock && (
          <div className="flex items-start gap-2 rounded-lg border border-error-200 bg-error-50 px-3 py-2">
            <AlertIcon size={16} className="mt-0.5 shrink-0 text-error-600" />
            <div>
              <p className="text-xs font-medium text-error-800">
                RTM Document — Billing Charges Exist
              </p>
              <p className="text-xs text-error-700">
                This is an RTM (Remote Therapeutic Monitoring) document.
                Billing charges exist for the same date and must be resolved
                before this document can be disputed.
              </p>
            </div>
          </div>
        )}

        {!hasLORBlock && !hasRTMBlock && (
          <p className="text-xs text-neutral-400">
            The document will be marked as disputed. The file is retained and
            the dispute will be visible in the document list.
          </p>
        )}
      </div>
    </Modal>
  );
}
