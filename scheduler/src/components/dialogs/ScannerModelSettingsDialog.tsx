import { useState, useEffect } from 'react';
import type { ScannerConfig, ScannerModel } from '../../types';
import { Modal } from '../Modal';
import { SettingsIcon } from '../Icons';
import { scanningService } from '../../services/scanningService';
import { LoadingSpinner, TBDNote } from '../Shared';

interface ScannerModelSettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ScannerModelSettingsDialog({ open, onClose }: ScannerModelSettingsDialogProps) {
  const [config, setConfig] = useState<ScannerConfig | null>(null);
  const [models, setModels] = useState<ScannerModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [clearOverride, setClearOverride] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      Promise.all([
        scanningService.getScannerConfig(),
        scanningService.getScannerModels(),
      ]).then(([cfg, mdls]) => {
        setConfig(cfg);
        setModels(mdls);
        setSelectedModel(cfg.userOverrideScmno);
        setClearOverride(false);
        setLoading(false);
      });
    }
  }, [open]);

  const handleSave = async () => {
    setSaving(true);
    if (clearOverride) {
      await scanningService.clearScannerModel();
    } else if (selectedModel !== null) {
      await scanningService.setScannerModel(selectedModel);
    }
    setSaving(false);
    onClose();
  };

  // AS-IS Legacy: SetScannerModel dialog shows:
  // - Dropdown of FNSCANNERMODELS
  // - "Clear Model and use Clinic Default" checkbox
  // - Save / Exit buttons
  // - "Current Selected" status line
  //
  // KNOWN LEGACY DISPLAY DEFECT: Shows "None" when no user override exists
  // (because the dialog's read omits the clinic-default join).
  // The proposed fix to show the clinic default is NOT yet approved.

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Scanner Model Settings"
      subtitle="Set your preferred scanner or use the clinic default"
      icon={<SettingsIcon size={20} />}
      size="md"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose} disabled={saving}>
            Exit
          </button>
          <button className="btn-primary" onClick={handleSave} disabled={saving || loading}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </>
      }
    >
      {loading ? (
        <LoadingSpinner label="Loading scanner settings..." />
      ) : config ? (
        <div className="space-y-4">
          {/* Current Selected — AS-IS status line */}
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
            <p className="text-xs font-medium text-neutral-500">Current Selected</p>
            {config.userOverrideScmno ? (
              <p className="text-sm font-medium text-neutral-700">
                {models.find((m) => m.scmno === config.userOverrideScmno)?.description || 'Unknown'}
                <span className="ml-2 text-xs text-primary-600">(Your override)</span>
              </p>
            ) : (
              <>
                {/* PROPOSED FIX: Show clinic default instead of "None" */}
                {/* AS-IS would show "None" here */}
                <p className="text-sm font-medium text-neutral-700">
                  {config.resolvedModel.description}
                  <span className="ml-2 text-xs text-neutral-400">(Clinic Default)</span>
                </p>
                <div className="mt-2">
                  <TBDNote>
                    AS-IS legacy shows "None" when no user override exists.
                    This prototype shows the clinic default as a proposed fix.
                    <strong> Client confirmation required — this display fix is NOT approved.</strong>
                  </TBDNote>
                </div>
              </>
            )}
          </div>

          {/* Scanner Model Dropdown — AS-IS: FNSCANNERMODELS */}
          <div>
            <label className="label">Scanner Model</label>
            <select
              className="select"
              value={selectedModel ?? ''}
              onChange={(e) => {
                setSelectedModel(Number(e.target.value));
                setClearOverride(false);
              }}
              disabled={clearOverride}
            >
              <option value="">— Select —</option>
              {models.map((m) => (
                <option key={m.scmno} value={m.scmno}>{m.description}</option>
              ))}
            </select>
          </div>

          {/* Clear Override Checkbox — AS-IS: "Clear Model and use Clinic Default" */}
          <div className="flex items-center gap-3 rounded-lg border border-neutral-200 px-4 py-3">
            <input
              type="checkbox"
              id="clear-override"
              checked={clearOverride}
              onChange={(e) => {
                setClearOverride(e.target.checked);
                if (e.target.checked) setSelectedModel(null);
              }}
              className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="clear-override" className="text-sm text-neutral-700 cursor-pointer">
              Clear Model and use Clinic Default
            </label>
          </div>

          {/* Clinic Default Info */}
          <div className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2">
            <p className="text-xs font-medium text-neutral-500">Clinic Default Scanner</p>
            <p className="text-sm text-neutral-700">
              {models.find((m) => m.scmno === config.clinicDefaultScmno)?.description || 'Unknown'}
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              Used when no personal override is set. Precedence: user override → clinic default.
            </p>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
