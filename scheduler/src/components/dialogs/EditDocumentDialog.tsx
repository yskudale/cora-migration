import { useState, useEffect } from 'react';
import type { ScannedDocument, ScanContextType, DocumentCategory } from '../../types';
import { Modal } from '../Modal';
import { EditIcon } from '../Icons';

interface EditDocumentDialogProps {
  open: boolean;
  onClose: () => void;
  document: ScannedDocument | null;
  contextType: ScanContextType;
  categories: DocumentCategory[];
  onSuccess: () => void;
}

export function EditDocumentDialog({
  open,
  onClose,
  document: doc,
  contextType,
  categories,
  onSuccess,
}: EditDocumentDialogProps) {
  const [category, setCategory] = useState<number>(0);
  const [referenceDate, setReferenceDate] = useState('');

  useEffect(() => {
    if (doc) {
      setCategory(doc.categoryEcno);
      setReferenceDate(doc.referenceDate || '');
    }
  }, [doc]);

  if (!doc) return null;

  // AS-IS: Reference date field appears ONLY for CLINICSIGNIN document type
  const showReferenceDate = contextType === 'CLINICSIGNIN' || doc.categoryLabel === 'Sign-In Sheet';

  const handleSave = () => {
    onSuccess();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Document"
      subtitle={doc.description}
      icon={<EditIcon size={20} />}
      size="sm"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Save</button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="label">Document Type / Category</label>
          <select
            className="select"
            value={category}
            onChange={(e) => setCategory(Number(e.target.value))}
          >
            {categories.map((c) => (
              <option key={c.ecno} value={c.ecno}>{c.label}</option>
            ))}
          </select>
        </div>

        {showReferenceDate ? (
          <div>
            <label className="label">Reference Date</label>
            <input
              className="input"
              type="date"
              value={referenceDate}
              onChange={(e) => setReferenceDate(e.target.value)}
            />
            <p className="mt-1 text-xs text-neutral-400">
              Available for Sign-In Sheet documents only
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2">
            <p className="text-xs text-neutral-400">
              Reference Date is not available for this document type.
              It is only editable for Sign-In Sheet (CLINICSIGNIN) documents.
            </p>
          </div>
        )}

        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
          <p className="text-xs font-medium text-neutral-500">Document Info</p>
          <div className="mt-1 space-y-1">
            <div className="flex justify-between">
              <span className="text-xs text-neutral-400">Scanned</span>
              <span className="text-xs text-neutral-600">{doc.scanDate} {doc.scanTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-neutral-400">Scanner</span>
              <span className="text-xs text-neutral-600">{doc.scannerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-neutral-400">Pages</span>
              <span className="text-xs text-neutral-600">{doc.pageCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
