import type {
  ScannedDocument,
  PatientInfo,
  PatientScanStatusItem,
  ClinicStatusRow,
  ScannerConfig,
  SignedNote,
  CollectionRefundRow,
  ScreeningPatient,
  ScannerModel,
  LocationGate,
} from '../types';
import {
  MOCK_DOCUMENTS,
  MOCK_PATIENT,
  MOCK_PATIENT_SCAN_STATUS,
  MOCK_CLINIC_STATUS,
  MOCK_SCANNER_CONFIG,
  MOCK_SIGNED_NOTES,
  MOCK_COLLECTION_REFUNDS,
  MOCK_SCREENING_PATIENT,
  MOCK_SCANNER_MODELS,
  MOCK_LOCATIONS,
} from '../data/mockData';

// Mock Service Layer
// This layer simulates the future C# CORA API.
// All data is synthetic. No real API calls are made.
// In production, these methods would call the C# API endpoints.

const SIMULATED_DELAY = 600;

function delay<T>(value: T, ms = SIMULATED_DELAY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const scanningService = {
  async getDocuments(_patientId: string): Promise<ScannedDocument[]> {
    return delay(MOCK_DOCUMENTS.filter((d) => d.patientName === MOCK_PATIENT.patientName));
  },

  async getPatientInfo(_patientId: string): Promise<PatientInfo> {
    return delay(MOCK_PATIENT);
  },

  async getPatientScanStatus(_patientId: string): Promise<PatientScanStatusItem[]> {
    return delay(MOCK_PATIENT_SCAN_STATUS);
  },

  async getClinicStatus(_locationId: string): Promise<ClinicStatusRow[]> {
    return delay(MOCK_CLINIC_STATUS);
  },

  async getScannerConfig(): Promise<ScannerConfig> {
    return delay(MOCK_SCANNER_CONFIG);
  },

  async getScannerModels(): Promise<ScannerModel[]> {
    return delay(MOCK_SCANNER_MODELS);
  },

  async setScannerModel(_scmno: number): Promise<{ success: boolean }> {
    return delay({ success: true }, 400);
  },

  async clearScannerModel(): Promise<{ success: boolean }> {
    return delay({ success: true }, 400);
  },

  async getSignedNotes(_patientId: string): Promise<SignedNote[]> {
    return delay(MOCK_SIGNED_NOTES);
  },

  async getCollectionRefunds(status: CollectionRefundRow['status']): Promise<CollectionRefundRow[]> {
    return delay(MOCK_COLLECTION_REFUNDS.filter((r) => r.status === status));
  },

  async getScreeningPatient(_pscno: string): Promise<ScreeningPatient> {
    return delay(MOCK_SCREENING_PATIENT);
  },

  async getLocations(): Promise<LocationGate[]> {
    return delay(MOCK_LOCATIONS);
  },

  async deleteDocument(_erno: string): Promise<{ success: boolean }> {
    return delay({ success: true }, 500);
  },

  async disputeDocument(erno: string): Promise<{ success: boolean; error?: string }> {
    const doc = MOCK_DOCUMENTS.find((d) => d.erno === erno);
    if (doc?.isLOR && doc.scannerName !== 'Current User') {
      return delay({ success: false, error: 'LOR_NOT_ORIGINAL_SCANNER' }, 500);
    }
    if (doc?.isRTM) {
      return delay({ success: false, error: 'RTM_CHARGES_EXIST' }, 500);
    }
    return delay({ success: true }, 500);
  },

  async editDocument(_erno: string, _data: { categoryEcno?: number; referenceDate?: string }): Promise<{ success: boolean }> {
    return delay({ success: true }, 500);
  },

  async changeDocumentType(_erno: string, _newCategoryEcno: number): Promise<{ success: boolean }> {
    return delay({ success: true }, 500);
  },

  async tagSignedNote(_erno: string, _noteNumber: number): Promise<{ success: boolean }> {
    return delay({ success: true }, 500);
  },

  async emailDocument(_erno: string, _recipient: string): Promise<{ success: boolean }> {
    return delay({ success: true }, 800);
  },

  async scanToEmail(_recipient: string, _colorMode: string, _sides: number): Promise<{ success: boolean }> {
    return delay({ success: true }, 1200);
  },

  async performScan(): Promise<{ success: boolean; pageCount: number; error?: string }> {
    return delay({ success: true, pageCount: 3 }, 2000);
  },

  async uploadFile(_file: File, _categoryEcno: number): Promise<{ success: boolean; erno?: string; error?: string }> {
    return delay({ success: true, erno: 'ED-' + Date.now() }, 1500);
  },

  async logViewAction(_erno: string): Promise<{ success: boolean }> {
    return delay({ success: true }, 200);
  },

  async logPrintAction(_erno: string): Promise<{ success: boolean }> {
    return delay({ success: true }, 200);
  },

  async performScreeningScan(_pscno: string, _description: string): Promise<{ success: boolean }> {
    return delay({ success: true }, 2000);
  },

  async performCollectionScan(_mrno: string): Promise<{ success: boolean }> {
    return delay({ success: true }, 1500);
  },
};
