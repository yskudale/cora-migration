import { useState, useEffect } from 'react';
import type { ScannedDocument, DocumentCategory } from '../../types';
import { Modal } from '../Modal';
import { TagIcon } from '../Icons';

interface ChangeTypeDialogProps {
  open: boolean;
  onClose: () => void;
  document: ScannedDocument | null;
  categories: DocumentCategory[];
  onSuccess: () => void;
}

export function ChangeTypeDialog({ open, onClose, document: doc, categories, onSuccess }: ChangeTypeDialogProps) {
  const [newCategory, setNewCategory] = useState<number>(0);

  useEffect(() => {
    if (doc) {
      setNewCategory(doc.categoryEcno);
    }
  }, [doc]);

  if (!doc) return null;

  const handleSave = () => {
    onSuccess();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Change Document Type"
      subtitle={doc.description}
      icon={<TagIcon size={20} />}
      size="sm"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Save Change</button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
          <p className="text-xs font-medium text-neutral-500">Current Type</p>
          <p className="text-sm font-medium text-neutral-700">{doc.categoryLabel}</p>
        </div>

        <div>
          <label className="label">New Document Type</label>
          <select
            className="select"
            value={newCategory}
            onChange={(e) => setNewCategory(Number(e.target.value))}
          >
            {categories.map((c) => (
              <option key={c.ecno} value={c.ecno}>{c.label}</option>
            ))}
          </select>
        </div>

        <p className="text-xs text-neutral-400">
          Changing the document type reclassifies this document in the patient's record.
          The file itself is not modified.
        </p>
      </div>
    </Modal>
  );
}
