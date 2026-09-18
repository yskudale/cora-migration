import { useState } from 'react';
import type { ScannedDocument } from '../../types';
import { Modal } from '../Modal';
import { TrashIcon, AlertIcon } from '../Icons';

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  document: ScannedDocument | null;
  onSuccess: () => void;
  onError: (msg: string, detail?: string) => void;
}

export function DeleteDialog({ open, onClose, document: doc, onSuccess, onError }: DeleteDialogProps) {
  const [loading, setLoading] = useState(false);

  if (!doc) return null;

  // AS-IS: RTM scans (erecno=32) cannot be deleted when billing charges exist for same date
  const hasRTMBlock = doc.isRTM;

  const handleConfirm = async () => {
    if (hasRTMBlock) {
      onError(
        'Cannot delete this RTM document',
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
      title="Delete Document"
      icon={<TrashIcon size={20} />}
      size="sm"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn-danger" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Yes, Remove'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-50">
            <AlertIcon size={20} className="text-error-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-800">
              Are you sure you want to remove this document?
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              {doc.categoryLabel} — {doc.description}
            </p>
          </div>
        </div>

        {hasRTMBlock && (
          <div className="flex items-start gap-2 rounded-lg border border-error-200 bg-error-50 px-3 py-2">
            <AlertIcon size={16} className="mt-0.5 shrink-0 text-error-600" />
            <div>
              <p className="text-xs font-medium text-error-800">
                This is an RTM document with billing charges
              </p>
              <p className="text-xs text-error-700">
                Billing charges exist for the same date. The document cannot be deleted
                until those charges are resolved.
              </p>
            </div>
          </div>
        )}

        <p className="text-xs text-neutral-400">
          The document will be marked as removed but the file is retained.
          This is a soft-delete — no data is permanently erased.
        </p>
      </div>
    </Modal>
  );
}
