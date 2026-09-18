import { useState, useEffect } from 'react';
import type { CollectionRefundRow } from '../types';
import { scanningService } from '../services/scanningService';
import { LoadingSpinner, EmptyState, TBDArchNote } from './Shared';
import { DollarIcon, ScanIcon, ArrowRightIcon, LoaderIcon } from './Icons';

type Tab = 'negative_balance' | 'requested' | 'awaiting_ap' | 'completed';

const tabLabels: Record<Tab, string> = {
  negative_balance: 'Negative Balance Queue',
  requested: 'Requested',
  awaiting_ap: 'Awaiting AP',
  completed: 'Completed',
};

export function CollectionRefunds() {
  const [activeTab, setActiveTab] = useState<Tab>('negative_balance');
  const [rows, setRows] = useState<CollectionRefundRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanningMrno, setScanningMrno] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    setLoading(true);
    scanningService.getCollectionRefunds(activeTab).then((data) => {
      setRows(data);
      setLoading(false);
    });
  }, [activeTab]);

  // AS-IS: PatientRefunds.java has two scan patterns:
  // 1. jMenuItem1 — "Patient Scanning Station" — opens full workstation (patient-level)
  // 2. jMenuItem10 — "Scan Documentation" — inline collection scan via DMScanning.scanCollectionItem(mrno)
  //
  // The inline scan calls the collection scan API directly without opening a workstation.

  const handleInlineScan = async (row: CollectionRefundRow) => {
    // mrno resolution: PRD states mrno must be derived server-side from bfno
    // Source confirmation for getMRNOFromBFNO() is not cited — TBD
    setScanningMrno(row.bfno);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((p) => Math.min(p + 10, 90));
    }, 200);

    await new Promise((r) => setTimeout(r, 1500));

    clearInterval(interval);
    setScanProgress(100);

    setTimeout(() => {
      setScanningMrno(null);
      setScanProgress(0);
    }, 1000);
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-neutral-800">Collection / Refund Scanning</h2>
        <p className="text-sm text-neutral-500">
          PatientRefunds screen with inline collection scanning and patient-level workstation access.
        </p>
      </div>

      {/* Two scan patterns info */}
      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <div className="card">
          <div className="card-body py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                <ArrowRightIcon size={20} className="text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Patient-Level Scanning</p>
                <p className="text-xs text-neutral-400">
                  Opens full scanning workstation for the patient (jMenuItem1)
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-100">
                <ScanIcon size={20} className="text-accent-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Inline Collection Scan</p>
                <p className="text-xs text-neutral-400">
                  Scans directly without opening workstation (jMenuItem10)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex border-b border-neutral-200">
          {(Object.keys(tabLabels) as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-700'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <DollarIcon size={16} />
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner label={`Loading ${tabLabels[activeTab]}...`} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<DollarIcon size={36} />}
            title="No records"
            message={`No ${tabLabels[activeTab].toLowerCase()} records found.`}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-xs font-medium text-neutral-500">
                  <th className="px-4 py-2.5">BFNO</th>
                  <th className="px-4 py-2.5">Patient</th>
                  <th className="px-4 py-2.5">Balance</th>
                  <th className="px-4 py-2.5">Refund Amount</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.bfno}
                    className="border-b border-neutral-100 transition-colors hover:bg-neutral-50"
                  >
                    <td className="px-4 py-3 text-sm text-neutral-600">{row.bfno}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-neutral-700">{row.patientName}</p>
                      <p className="text-xs text-neutral-400">{row.patientId}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-error-600">
                      ${row.balance.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      ${row.refundAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {/* Patient-level scan — opens full workstation */}
                        <button
                          className="btn-secondary btn-sm"
                          title="Open patient scanning workstation"
                        >
                          <ArrowRightIcon size={14} /> Patient Scan
                        </button>

                        {/* Inline collection scan — scans directly */}
                        <button
                          className="btn-primary btn-sm"
                          title="Scan documentation inline (collection scan)"
                          onClick={() => handleInlineScan(row)}
                          disabled={scanningMrno === row.bfno}
                        >
                          {scanningMrno === row.bfno ? (
                            <>
                              <LoaderIcon size={14} /> Scanning...
                            </>
                          ) : (
                            <>
                              <ScanIcon size={14} /> Scan Doc
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Inline scan progress overlay */}
        {scanningMrno && (
          <div className="border-t border-neutral-200 bg-primary-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <LoaderIcon size={20} className="text-primary-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-primary-700">
                  Inline collection scan in progress...
                </p>
                <p className="text-xs text-primary-600">
                  BFNO: {scanningMrno} — Scanning documentation for this refund
                </p>
              </div>
              <div className="w-32">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary-100">
                  <div
                    className="h-full rounded-full bg-primary-600 transition-all duration-200"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TBD Note for mrno resolution */}
      <div className="mt-4">
        <TBDArchNote>
          mrno resolution from bfno: The PRD states mrno must be derived server-side from bfno.
          Source confirmation for getMRNOFromBFNO() is not cited with file/line references.
          This prototype uses bfno as the identifier — actual mrno resolution is TBD.
        </TBDArchNote>
      </div>
    </div>
  );
}
