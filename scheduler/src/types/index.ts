// CORA Scanning Module — Domain Types
// Based on draft PRD and validation review. All types reflect confirmed requirements only.

export type ScanContextType =
  | 'PATIENT'
  | 'CLINICSIGNIN'
  | 'CLINICCOPAY'
  | 'REFERRAL'
  | 'COLLECTION'
  | 'SCREEN';

export type DocumentStatus = 'present' | 'missing' | 'disputed';

export type DocRowStatus = 'active' | 'disputed' | 'deleted';

export interface DocumentCategory {
  ecno: number;
  label: string;
  description: string;
}

export interface ScannedDocument {
  erno: string;
  patientName: string;
  categoryEcno: number;
  categoryLabel: string;
  description: string;
  scanDate: string;
  scanTime: string;
  scannerName: string;
  status: DocRowStatus;
  referenceDate?: string;
  signedNoteNumber?: number;
  signedNoteLabel?: string;
  isLOR: boolean;
  isRTM: boolean;
  fileSize: number;
  pageCount: number;
  thumbnailColor: string;
}

export interface PatientInfo {
  patientName: string;
  patientId: string;
  dateOfBirth: string;
  locationName: string;
  locationId: string;
  episodeId?: string;
}

export interface PatientScanStatusItem {
  categoryEcno: number;
  categoryLabel: string;
  status: DocumentStatus;
  lastScanDate?: string;
}

export interface ClinicStatusRow {
  appointmentDate: string;
  patientName: string;
  patientId: string;
  signInStatus: DocumentStatus;
  copayStatus: DocumentStatus;
}

export interface ScannerModel {
  scmno: number;
  description: string;
}

export interface ScannerConfig {
  userOverrideScmno: number | null;
  clinicDefaultScmno: number;
  resolvedModel: ScannerModel;
  resolvedSource: 'user_override' | 'clinic_default';
}

export interface SignedNote {
  noteNumber: number;
  noteType: string;
  noteDate: string;
  providerName: string;
}

export interface CollectionRefundRow {
  bfno: string;
  patientName: string;
  patientId: string;
  balance: number;
  refundAmount: number;
  status: 'negative_balance' | 'requested' | 'awaiting_ap' | 'completed';
  mrno?: string;
}

export interface ScreeningPatient {
  pscno: string;
  patientName: string;
  patientId: string;
  description: string;
}

export interface ScanToEmailConfig {
  recipient: string;
  colorMode: 'COLOR' | 'GRAYSCALE';
  sides: number;
}

export interface LocationGate {
  locationId: string;
  locationName: string;
  isScanningOn: boolean;
  isDHSMode: boolean;
}

export interface TBDItem {
  id: string;
  label: string;
  category: 'architecture' | 'business' | 'compliance' | 'scope';
  description: string;
  source: string;
}

export type DialogType =
  | 'scan'
  | 'upload'
  | 'view'
  | 'edit'
  | 'delete'
  | 'dispute'
  | 'changeType'
  | 'email'
  | 'signedNote'
  | 'scannerSettings'
  | 'scanToEmail'
  | null;

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  detail?: string;
}
