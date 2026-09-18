import { useState, useEffect } from 'react';
import type { LocationGate } from '../types';
import { scanningService } from '../services/scanningService';
import { LoadingSpinner, TBDBadge } from './Shared';
import { ShieldIcon, ScanIcon, LockIcon } from './Icons';

export function GlobalGatesDemo() {
  const [locations, setLocations] = useState<LocationGate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    scanningService.getLocations().then((data) => {
      setLocations(data);
      setSelectedLocation(data[0]?.locationId || '');
      setLoading(false);
    });
  }, []);

  const current = locations.find((l) => l.locationId === selectedLocation);

  // AS-IS: Two global gates that hide scanning controls:
  // 1. Location scanning gate (isScanningOn per location) — ScheduleTable.java L3019, L3036
  // 2. DHS mode gate — suppresses ALL scanning when DHS status is true (L3305-3306)

  if (loading) return <LoadingSpinner label="Loading locations..." />;

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-neutral-800">Global Gates — Scanning Availability</h2>
        <p className="text-sm text-neutral-500">
          Demonstrates how scanning controls are hidden when scanning is disabled for a location
          or when DHS mode is active.
        </p>
      </div>

      {/* Location Selector */}
      <div className="card mb-4">
        <div className="card-body py-4">
          <label className="label">Select Location to Preview</label>
          <div className="flex flex-wrap gap-2">
            {locations.map((loc) => (
              <button
                key={loc.locationId}
                onClick={() => setSelectedLocation(loc.locationId)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedLocation === loc.locationId
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {loc.locationName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {current && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Gate Status */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <ShieldIcon size={18} className="text-primary-600" />
                <h3 className="text-sm font-semibold text-neutral-700">Gate Status</h3>
              </div>
            </div>
            <div className="card-body space-y-3">
              <GateIndicator
                label="Location Scanning Gate (isScanningOn)"
                enabled={current.isScanningOn}
                description={current.isScanningOn ? 'Scanning is enabled at this location' : 'Scanning is disabled at this location'}
              />
              <GateIndicator
                label="DHS Mode Gate"
                enabled={!current.isDHSMode}
                description={current.isDHSMode ? 'DHS mode is active — ALL scanning suppressed' : 'DHS mode is not active'}
              />
            </div>
          </div>

          {/* Simulated Workstation Preview */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-sm font-semibold text-neutral-700">Workstation Preview</h3>
            </div>
            <div className="card-body">
              {current.isScanningOn && !current.isDHSMode ? (
                /* Normal — scanning controls visible */
                <div className="space-y-3">
                  <div className="flex items-center gap-2 rounded-lg border border-success-200 bg-success-50 px-3 py-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-success-500" />
                    <p className="text-xs font-medium text-success-800">
                      Scanning controls are visible and active
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-primary btn-sm" disabled>
                      <ScanIcon size={16} /> Scan
                    </button>
                    <button className="btn-secondary btn-sm" disabled>Upload</button>
                    <button className="btn-secondary btn-sm" disabled>Scan to Email</button>
                  </div>
                  <p className="text-xs text-neutral-400">
                    All scanning controls are available to the user.
                  </p>
                </div>
              ) : (
                /* Gate active — scanning controls hidden */
                <div className="space-y-3">
                  {!current.isScanningOn && (
                    <div className="flex items-start gap-3 rounded-lg border border-warning-200 bg-warning-50 px-4 py-3">
                      <LockIcon size={20} className="mt-0.5 shrink-0 text-warning-600" />
                      <div>
                        <p className="text-sm font-medium text-warning-800">
                          Scanning is disabled for this location
                        </p>
                        <p className="text-xs text-warning-700 mt-0.5">
                          The Scan, Upload, and Scan-to-Email controls are hidden.
                          This is the location scanning gate (isScanningOn = false).
                        </p>
                      </div>
                    </div>
                  )}
                  {current.isDHSMode && (
                    <div className="flex items-start gap-3 rounded-lg border border-error-200 bg-error-50 px-4 py-3">
                      <ShieldIcon size={20} className="mt-0.5 shrink-0 text-error-600" />
                      <div>
                        <p className="text-sm font-medium text-error-800">
                          DHS Mode Active — All Scanning Suppressed
                        </p>
                        <p className="text-xs text-error-700 mt-0.5">
                          DHS mode clears the entire scanning popup and rebuilds with
                          enterprise-master items only. No scanning controls are shown.
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 opacity-40">
                    <button className="btn-primary btn-sm" disabled>
                      <ScanIcon size={16} /> Scan
                    </button>
                    <button className="btn-secondary btn-sm" disabled>Upload</button>
                    <button className="btn-secondary btn-sm" disabled>Scan to Email</button>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Scanning controls are hidden/disabled due to active gate(s).
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3">
        <TBDBadge label="AS-IS Parity" />
        <p className="text-xs text-neutral-500">
          Source: ScheduleTable.java L3019, L3036 (location gate), L3305-3306 (DHS gate).
          How DHS mode is determined in the new architecture is a design question for the SDD.
        </p>
      </div>
    </div>
  );
}

function GateIndicator({ label, enabled, description }: { label: string; enabled: boolean; description: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-neutral-700">{label}</p>
        <p className="text-xs text-neutral-400">{description}</p>
      </div>
      <span
        className={`badge ${enabled ? 'badge-success' : 'badge-error'}`}
      >
        {enabled ? 'OPEN' : 'BLOCKED'}
      </span>
    </div>
  );
}
