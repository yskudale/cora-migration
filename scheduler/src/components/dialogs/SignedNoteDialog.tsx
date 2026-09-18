import { useState, useEffect } from 'react';
import type { ScannedDocument, SignedNote } from '../../types';
import { Modal } from '../Modal';
import { FileTextIcon, CheckCircleIcon } from '../Icons';
import { scanningService } from '../../services/scanningService';
import { LoadingSpinner, EmptyState } from '../Shared';

interface SignedNoteDialogProps {
  open: boolean;
  onClose: () => void;
  document: ScannedDocument | null;
  onSuccess: () => void;
}

export function SignedNoteDialog({ open, onClose, document: doc, onSuccess }: SignedNoteDialogProps) {
  const [notes, setNotes] = useState<SignedNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (open && doc) {
      setLoading(true);
      scanningService.getSignedNotes('PT-2024-0042').then((data) => {
        setNotes(data);
        setLoading(false);
      });
    }
  }, [open, doc]);

  if (!doc) return null;

  // AS-IS: noteNumber return values: -1 = "Other Note", -2 = Cancel (no-op)
  const handleSelect = (noteNumber: number) => {
    setSelected(noteNumber);
  };

  const handleConfirm = () => {
    if (selected === -2 || selected === null) {
      onClose();
      return;
    }
    onSuccess();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Tag to Signed Note"
      subtitle={doc.description}
      icon={<FileTextIcon size={20} />}
      size="md"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Cancel (No Change)</button>
          <button className="btn-primary" onClick={handleConfirm} disabled={selected === null}>
            Confirm Tag
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-neutral-600">
          Select a signed note to tag this document to. Draft notes are not shown.
        </p>

        {loading ? (
          <LoadingSpinner label="Loading signed notes..." />
        ) : notes.length === 0 ? (
          <EmptyState
            icon={<FileTextIcon size={36} />}
            title="No signed notes available"
            message="There are no signed clinical notes for this patient."
          />
        ) : (
          <div className="space-y-2">
            {notes.map((note) => (
              <button
                key={note.noteNumber}
                onClick={() => handleSelect(note.noteNumber)}
                className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                  selected === note.noteNumber
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 bg-white hover:bg-neutral-50'
                }`}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-100">
                  <FileTextIcon size={16} className="text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-700">{note.noteType}</p>
                  <p className="text-xs text-neutral-400">
                    {note.noteDate} — {note.providerName}
                  </p>
                </div>
                {selected === note.noteNumber && (
                  <CheckCircleIcon size={20} className="text-primary-600" />
                )}
              </button>
            ))}

            {/* "Other Note" option — AS-IS: noteNumber = -1 */}
            <button
              onClick={() => handleSelect(-1)}
              className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                selected === -1
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200 bg-white hover:bg-neutral-50'
              }`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                <FileTextIcon size={16} className="text-neutral-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-700">Other Note</p>
                <p className="text-xs text-neutral-400">Specify a different note</p>
              </div>
              {selected === -1 && <CheckCircleIcon size={20} className="text-primary-600" />}
            </button>
          </div>
        )}

        <div className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2">
          <p className="text-xs text-neutral-400">
            Cancel = no change (noteNumber -2). Other Note = manual entry (noteNumber -1).
            Only signed notes are shown — drafts are excluded.
          </p>
        </div>
      </div>
    </Modal>
  );
}
