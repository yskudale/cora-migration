import { useState } from 'react';
import type { ScannedDocument } from '../../types';
import { Modal } from '../Modal';
import { AuditIndicator, TBDBadge } from '../Shared';
import { MailIcon, PrintIcon, EyeIcon, FileTextIcon } from '../Icons';
import { EmailDialog } from './EmailDialog';

interface DocumentViewerDialogProps {
  open: boolean;
  onClose: () => void;
  document: ScannedDocument | null;
}

export function DocumentViewerDialog({ open, onClose, document }: DocumentViewerDialogProps) {
  const [showEmail, setShowEmail] = useState(false);

  if (!document) return null;

  return (
    <>
      <Modal
        open={open && !showEmail}
        onClose={onClose}
        title="Document Preview"
        subtitle={`${document.categoryLabel} — ${document.description}`}
        icon={<EyeIcon size={20} />}
        size="xl"
        footer={
          <>
            <button className="btn-secondary" onClick={() => window.print()}>
              <PrintIcon size={16} /> Print
            </button>
            <button className="btn-secondary" onClick={() => setShowEmail(true)}>
              <MailIcon size={16} /> Email
            </button>
            <button className="btn-primary" onClick={onClose}>Close</button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Document info bar */}
          <div className="flex flex-wrap items-center gap-4 rounded-lg bg-neutral-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <FileTextIcon size={16} className="text-neutral-400" />
              <span className="text-sm font-medium text-neutral-700">{document.description}</span>
            </div>
            <div className="text-xs text-neutral-400">
              Scanned: {document.scanDate} at {document.scanTime}
            </div>
            <div className="text-xs text-neutral-400">
              {document.pageCount} page(s) · {(document.fileSize / 1024).toFixed(0)} KB
            </div>
            <div className="flex-1" />
            <AuditIndicator action={`View logged at ${new Date().toLocaleTimeString()}`} />
          </div>

          {/* PDF Preview placeholder */}
          <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 py-16">
            <div className="text-center">
              <FileTextIcon size={48} className="mx-auto text-neutral-300" />
              <p className="mt-3 text-sm font-medium text-neutral-500">PDF Document Preview</p>
              <p className="text-xs text-neutral-400">
                {document.pageCount} page(s) — {document.categoryLabel}
              </p>
              <div className="mt-4">
                <TBDBadge label="PDF delivery mechanism — TBD (OC-2)" />
              </div>
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-center gap-2 rounded-lg border border-success-200 bg-success-50 px-3 py-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-success-500" />
            <p className="text-xs text-success-800">
              Internal storage paths are never exposed in the UI. Document is served via API.
            </p>
          </div>
        </div>
      </Modal>

      <EmailDialog
        open={showEmail}
        onClose={() => setShowEmail(false)}
        document={document}
        onSuccess={() => setShowEmail(false)}
      />
    </>
  );
}
