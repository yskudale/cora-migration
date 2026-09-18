import { useEffect, useState } from 'react';
import type { PatientScanStatusItem } from '../types';
import { scanningService } from '../services/scanningService';
import { LoadingSpinner, EmptyState, StatusBadge } from './Shared';
import { ClipboardListIcon } from './Icons';

interface PatientScanStatusProps {
  patientId: string;
}

export function PatientScanStatus({ patientId }: PatientScanStatusProps) {
  const [items, setItems] = useState<PatientScanStatusItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    scanningService.getPatientScanStatus(patientId).then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, [patientId]);

  const presentCount = items.filter((i) => i.status === 'present').length;
  const missingCount = items.filter((i) => i.status === 'missing').length;
  const disputedCount = items.filter((i) => i.status === 'disputed').length;

  return (
    <div className="card h-full">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <ClipboardListIcon size={18} className="text-primary-600" />
          <h3 className="text-sm font-semibold text-neutral-700">Patient Scan Status</h3>
        </div>
        <div className="flex gap-2">
          <span className="badge-success">{presentCount} Present</span>
          {missingCount > 0 && <span className="badge-error">{missingCount} Missing</span>}
          {disputedCount > 0 && <span className="badge-warning">{disputedCount} Disputed</span>}
        </div>
      </div>
      <div className="card-body">
        {loading ? (
          <LoadingSpinner label="Loading scan status..." />
        ) : items.length === 0 ? (
          <EmptyState icon={<ClipboardListIcon size={36} />} title="No status data" message="No document categories configured." />
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.categoryEcno}
                className="flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2.5 transition-colors hover:bg-neutral-50"
              >
                <div className="flex items-center gap-3">
                  <StatusDot status={item.status} />
                  <div>
                    <p className="text-sm font-medium text-neutral-700">{item.categoryLabel}</p>
                    {item.lastScanDate && (
                      <p className="text-xs text-neutral-400">Last scanned: {item.lastScanDate}</p>
                    )}
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: 'present' | 'missing' | 'disputed' }) {
  const colorMap = {
    present: 'bg-success-500',
    missing: 'bg-error-500',
    disputed: 'bg-warning-500',
  };
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${colorMap[status]}`}
      aria-label={status}
    />
  );
}
