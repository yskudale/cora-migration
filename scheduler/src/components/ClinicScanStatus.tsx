import { useEffect, useState } from 'react';
import type { ClinicStatusRow } from '../types';
import { scanningService } from '../services/scanningService';
import { LoadingSpinner, EmptyState, StatusBadge, TBDBadge } from './Shared';
import { ClipboardListIcon, ArrowRightIcon } from './Icons';

export function ClinicScanStatus() {
  const [rows, setRows] = useState<ClinicStatusRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    scanningService.getClinicStatus('LC-001').then((data) => {
      setRows(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-neutral-800">Clinic Scan Status</h2>
        <p className="text-sm text-neutral-500">
          Sign-in and copay status for scheduled appointments at this clinic location.
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="flex items-center gap-2">
            <ClipboardListIcon size={18} className="text-primary-600" />
            <h3 className="text-sm font-semibold text-neutral-700">Appointment Status</h3>
          </div>
          <div className="flex gap-2">
            <span className="badge-success">Present</span>
            <span className="badge-error">Missing</span>
            <span className="badge-warning">Disputed</span>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading clinic status..." />
        ) : rows.length === 0 ? (
          <EmptyState icon={<ClipboardListIcon size={36} />} title="No appointments" message="No scheduled appointments found." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-xs font-medium text-neutral-500">
                  <th className="px-4 py-2.5">Appointment Date</th>
                  <th className="px-4 py-2.5">Patient</th>
                  <th className="px-4 py-2.5">Sign-In Status</th>
                  <th className="px-4 py-2.5">Copay Status</th>
                  <th className="px-4 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-neutral-100 transition-colors hover:bg-neutral-50"
                  >
                    <td className="px-4 py-3 text-sm text-neutral-600">{row.appointmentDate}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-neutral-700">{row.patientName}</p>
                      <p className="text-xs text-neutral-400">{row.patientId}</p>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={row.signInStatus} /></td>
                    <td className="px-4 py-3"><StatusBadge status={row.copayStatus} /></td>
                    <td className="px-4 py-3 text-right">
                      {(row.signInStatus === 'missing' || row.copayStatus === 'missing') && (
                        <button
                          className="btn-secondary btn-sm"
                          title="Navigate to patient scanning workstation"
                        >
                          Open Patient Scan
                          <ArrowRightIcon size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-warning-200 bg-warning-50 px-4 py-3">
        <TBDBadge label="Pending source confirmation" />
        <p className="text-xs text-warning-800">
          Click-through navigation from missing-scan rows to the patient scanning workstation
          is documented in the PRD but source confirmation for the exact click-through behavior
          is not cited with file/line references.
        </p>
      </div>
    </div>
  );
}
