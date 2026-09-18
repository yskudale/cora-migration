import { useState, useEffect } from 'react';
import type { ScanContextType, ScannedDocument, PatientInfo, DialogType } from '../types';
import { scanningService } from '../services/scanningService';
import { useToast } from './Toast';
import { LoadingSpinner, EmptyState, DocRowBadge } from './Shared';
import {
  ScanIcon, UploadIcon, EyeIcon, PrintIcon, MailIcon, EditIcon, TrashIcon,
  AlertIcon, RefreshIcon, FileTextIcon, TagIcon, SettingsIcon, ChevronDownIcon,
} from './Icons';
import { ScanDialog } from './dialogs/ScanDialog';
import { FileUploadDialog } from './dialogs/FileUploadDialog';
import { DocumentViewerDialog } from './dialogs/DocumentViewerDialog';
import { EditDocumentDialog } from './dialogs/EditDocumentDialog';
import { DeleteDialog } from './dialogs/DeleteDialog';
import { DisputeDialog } from './dialogs/DisputeDialog';
import { ChangeTypeDialog } from './dialogs/ChangeTypeDialog';
import { EmailDialog } from './dialogs/EmailDialog';
import { SignedNoteDialog } from './dialogs/SignedNoteDialog';
import { ScannerModelSettingsDialog } from './dialogs/ScannerModelSettingsDialog';
import { ScanToEmailDialog } from './dialogs/ScanToEmailDialog';
import { PatientScanStatus } from './PatientScanStatus';
import { DOCUMENT_CATEGORIES } from '../data/mockData';

interface ScanWorkstationProps {
  contextType: ScanContextType;
  onContextChange: (type: ScanContextType) => void;
}

const contextLabels: Record<ScanContextType, string> = {
  PATIENT: 'Patient Scanning',
  CLINICSIGNIN: 'Clinic Sign-In',
  CLINICCOPAY: 'Clinic Copay',
  REFERRAL: 'Referral',
  COLLECTION: 'Collection',
  SCREEN: 'Screening',
};

const contextDescriptions: Record<ScanContextType, string> = {
  PATIENT: 'Full document scanning workstation for a patient episode',
  CLINICSIGNIN: 'Sign-in sheet scanning with copay tracking',
  CLINICCOPAY: 'Copay receipt scanning and management',
  REFERRAL: 'Referral document capture and management',
  COLLECTION: 'Collection item scanning (inline from PatientRefunds)',
  SCREEN: 'Minimal screening capture — no document list or toolbar',
};

export function ScanWorkstation({ contextType, onContextChange }: ScanWorkstationProps) {
  const { showToast } = useToast();
  const [documents, setDocuments] = useState<ScannedDocument[]>([]);
  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<ScannedDocument | null>(null);
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [showStatus, setShowStatus] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      scanningService.getDocuments('PT-2024-0042'),
      scanningService.getPatientInfo('PT-2024-0042'),
    ]).then(([docs, pat]) => {
      setDocuments(docs);
      setPatient(pat);
      setLoading(false);
    });
  }, [contextType]);

  const handleDialogClose = () => {
    setActiveDialog(null);
    setSelectedDoc(null);
  };

  const handleActionSuccess = (message: string, detail?: string) => {
    showToast('success', message, detail);
    handleDialogClose();
  };

  const handleActionError = (message: string, detail?: string) => {
    showToast('error', message, detail);
  };

  const isScreenContext = contextType === 'SCREEN';

  if (isScreenContext) {
    return (
      <div className="p-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center gap-3 rounded-lg bg-primary-50 px-4 py-3 text-primary-800">
              <InfoIconLocal />
              <p className="text-sm">
                <strong>Screening Scan</strong> uses a minimal capture view (description + scan button only).
                The full workstation is not displayed for this context. See the Screening Scan view in the sidebar.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      {/* Context Selector */}
      <div className="card">
        <div className="card-body py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="label">Scanning Context (Type)</label>
              <div className="relative">
                <select
                  className="select"
                  value={contextType}
                  onChange={(e) => onContextChange(e.target.value as ScanContextType)}
                >
                  {(Object.keys(contextLabels) as ScanContextType[]).map((t) => (
                    <option key={t} value={t}>{contextLabels[t]} — {t}</option>
                  ))}
                </select>
                <ChevronDownIcon size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <p className="text-sm text-neutral-500">{contextDescriptions[contextType]}</p>
              {contextType === 'CLINICSIGNIN' && (
                <p className="text-xs text-neutral-400 mt-1">
                  API mapping: CLINICSIGNIN → SIGNINSCAN
                </p>
              )}
            </div>
            <button
              className="btn-secondary btn-sm"
              onClick={() => setShowStatus(!showStatus)}
            >
              {showStatus ? 'Hide' : 'Show'} Patient Status
            </button>
          </div>
        </div>
      </div>

      {/* Patient Info + Scan Status */}
      {patient && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card lg:col-span-1">
            <div className="card-header">
              <h3 className="text-sm font-semibold text-neutral-700">Patient / Context</h3>
            </div>
            <div className="card-body space-y-2">
              <InfoRow label="Patient" value={patient.patientName} />
              <InfoRow label="Patient ID" value={patient.patientId} />
              <InfoRow label="Date of Birth" value={patient.dateOfBirth} />
              <InfoRow label="Location" value={patient.locationName} />
              {patient.episodeId && <InfoRow label="Episode" value={patient.episodeId} />}
              <div className="pt-2">
                <span className="tbd-badge">
                  <HelpCircleIconLocal /> Auth: TBD
                </span>
              </div>
            </div>
          </div>

          {showStatus && (
            <div className="lg:col-span-2">
              <PatientScanStatus patientId={patient.patientId} />
            </div>
          )}
        </div>
      )}

      {/* Main Workstation — Toolbar + Document List */}
      <div className="card">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 px-4 py-3">
          <button
            className="btn-primary btn-sm"
            onClick={() => setActiveDialog('scan')}
          >
            <ScanIcon size={16} /> Scan
          </button>
          <button
            className="btn-secondary btn-sm"
            onClick={() => setActiveDialog('upload')}
          >
            <UploadIcon size={16} /> Upload
          </button>
          <div className="mx-1 h-6 w-px bg-neutral-200" />
          <button
            className="btn-secondary btn-sm"
            onClick={() => setActiveDialog('scanToEmail')}
            title="Scan to Email (app-level, no document record)"
          >
            <MailIcon size={16} /> Scan to Email
          </button>
          <div className="mx-1 h-6 w-px bg-neutral-200" />
          <button
            className="btn-ghost btn-sm"
            onClick={() => setActiveDialog('scannerSettings')}
            title="Scanner Model Settings"
          >
            <SettingsIcon size={16} /> Scanner Settings
          </button>
          <div className="flex-1" />
          <button
            className="btn-ghost btn-sm"
            onClick={() => {
              setLoading(true);
              scanningService.getDocuments('PT-2024-0042').then((docs) => {
                setDocuments(docs);
                setLoading(false);
              });
            }}
          >
            <RefreshIcon size={16} /> Refresh
          </button>
        </div>

        {/* Document List */}
        <div className="overflow-x-auto">
          {loading ? (
            <LoadingSpinner label="Loading documents..." />
          ) : documents.length === 0 ? (
            <EmptyState
              icon={<FileTextIcon size={40} />}
              title="No documents scanned"
              message="Use Scan or Upload to add documents for this patient."
            />
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-xs font-medium text-neutral-500">
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Category</th>
                  <th className="px-4 py-2.5">Description</th>
                  <th className="px-4 py-2.5">Scan Date</th>
                  <th className="px-4 py-2.5">Scanner</th>
                  <th className="px-4 py-2.5">Pages</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr
                    key={doc.erno}
                    className="border-b border-neutral-100 transition-colors hover:bg-neutral-50"
                  >
                    <td className="px-4 py-3">
                      <DocRowBadge status={doc.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-8 w-8 shrink-0 rounded-lg"
                          style={{ backgroundColor: doc.thumbnailColor + '20' }}
                        >
                          <div className="flex h-full items-center justify-center">
                            <FileTextIcon size={16} style={{ color: doc.thumbnailColor }} />
                          </div>
                        </span>
                        <div>
                          <p className="text-sm font-medium text-neutral-700">{doc.categoryLabel}</p>
                          {doc.isLOR && <span className="text-xs text-error-600">LOR</span>}
                          {doc.isRTM && <span className="text-xs text-warning-600">RTM</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-neutral-600">{doc.description}</p>
                      {doc.signedNoteLabel && (
                        <p className="text-xs text-primary-600">Tagged: {doc.signedNoteLabel}</p>
                      )}
                      {doc.referenceDate && (
                        <p className="text-xs text-neutral-400">Ref: {doc.referenceDate}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-neutral-600">{doc.scanDate}</p>
                      <p className="text-xs text-neutral-400">{doc.scanTime}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-500">{doc.scannerName}</td>
                    <td className="px-4 py-3 text-sm text-neutral-500">{doc.pageCount}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="btn-icon"
                          title="View"
                          onClick={() => { setSelectedDoc(doc); setActiveDialog('view'); }}
                        >
                          <EyeIcon size={16} />
                        </button>
                        <button
                          className="btn-icon"
                          title="Print"
                          onClick={() => { setSelectedDoc(doc); setActiveDialog('view'); }}
                        >
                          <PrintIcon size={16} />
                        </button>
                        <button
                          className="btn-icon"
                          title="Email"
                          onClick={() => { setSelectedDoc(doc); setActiveDialog('email'); }}
                        >
                          <MailIcon size={16} />
                        </button>
                        <div className="mx-0.5 h-5 w-px bg-neutral-200" />
                        <button
                          className="btn-icon"
                          title="Edit"
                          onClick={() => { setSelectedDoc(doc); setActiveDialog('edit'); }}
                        >
                          <EditIcon size={16} />
                        </button>
                        <button
                          className="btn-icon"
                          title="Change Type"
                          onClick={() => { setSelectedDoc(doc); setActiveDialog('changeType'); }}
                        >
                          <TagIcon size={16} />
                        </button>
                        <button
                          className="btn-icon"
                          title="Tag to Signed Note"
                          onClick={() => { setSelectedDoc(doc); setActiveDialog('signedNote'); }}
                        >
                          <FileTextIcon size={16} />
                        </button>
                        <div className="mx-0.5 h-5 w-px bg-neutral-200" />
                        <button
                          className="btn-icon"
                          title="Dispute"
                          onClick={() => { setSelectedDoc(doc); setActiveDialog('dispute'); }}
                        >
                          <AlertIcon size={16} />
                        </button>
                        <button
                          className="btn-icon hover:text-error-600"
                          title="Delete"
                          onClick={() => { setSelectedDoc(doc); setActiveDialog('delete'); }}
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <ScanDialog
        open={activeDialog === 'scan'}
        onClose={handleDialogClose}
        contextType={contextType}
        onSuccess={() => handleActionSuccess('Document scanned successfully', '3 pages captured')}
      />
      <FileUploadDialog
        open={activeDialog === 'upload'}
        onClose={handleDialogClose}
        contextType={contextType}
        categories={DOCUMENT_CATEGORIES}
        onSuccess={() => handleActionSuccess('Document uploaded successfully')}
      />
      <DocumentViewerDialog
        open={activeDialog === 'view'}
        onClose={handleDialogClose}
        document={selectedDoc}
      />
      <EditDocumentDialog
        open={activeDialog === 'edit'}
        onClose={handleDialogClose}
        document={selectedDoc}
        contextType={contextType}
        categories={DOCUMENT_CATEGORIES}
        onSuccess={() => handleActionSuccess('Document updated successfully')}
      />
      <DeleteDialog
        open={activeDialog === 'delete'}
        onClose={handleDialogClose}
        document={selectedDoc}
        onSuccess={() => handleActionSuccess('Document removed (soft-deleted)')}
        onError={handleActionError}
      />
      <DisputeDialog
        open={activeDialog === 'dispute'}
        onClose={handleDialogClose}
        document={selectedDoc}
        onSuccess={() => handleActionSuccess('Document disputed successfully')}
        onError={handleActionError}
      />
      <ChangeTypeDialog
        open={activeDialog === 'changeType'}
        onClose={handleDialogClose}
        document={selectedDoc}
        categories={DOCUMENT_CATEGORIES}
        onSuccess={() => handleActionSuccess('Document type changed successfully')}
      />
      <EmailDialog
        open={activeDialog === 'email'}
        onClose={handleDialogClose}
        document={selectedDoc}
        onSuccess={() => handleActionSuccess('Document emailed successfully')}
      />
      <SignedNoteDialog
        open={activeDialog === 'signedNote'}
        onClose={handleDialogClose}
        document={selectedDoc}
        onSuccess={() => handleActionSuccess('Document tagged to signed note')}
      />
      <ScannerModelSettingsDialog
        open={activeDialog === 'scannerSettings'}
        onClose={handleDialogClose}
      />
      <ScanToEmailDialog
        open={activeDialog === 'scanToEmail'}
        onClose={handleDialogClose}
        onSuccess={() => handleActionSuccess('Scan-to-email sent successfully')}
      />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-neutral-400">{label}</span>
      <span className="text-sm font-medium text-neutral-700">{value}</span>
    </div>
  );
}

function InfoIconLocal() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function HelpCircleIconLocal() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
    </svg>
  );
}
