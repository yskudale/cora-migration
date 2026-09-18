import type { ReactNode } from 'react';
import { HelpCircleIcon } from './Icons';

// TBD Badge — for items requiring client/architecture confirmation
export function TBDBadge({ label = 'TBD' }: { label?: string }) {
  return (
    <span className="tbd-badge" title="This item is not yet confirmed — pending client or architecture decision">
      <HelpCircleIcon size={12} />
      {label}
    </span>
  );
}

// TBD Inline Note — for inline annotations in dialogs
export function TBDNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-warning-200 bg-warning-50 px-3 py-2">
      <HelpCircleIcon size={16} className="mt-0.5 shrink-0 text-warning-600" />
      <div className="text-xs text-warning-800">
      <span className="font-semibold">TBD — Client Confirmation Required: </span>
        {children}
      </div>
    </div>
  );
}

// TBD Architecture Note
export function TBDArchNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-primary-200 bg-primary-50 px-3 py-2">
      <HelpCircleIcon size={16} className="mt-0.5 shrink-0 text-primary-600" />
      <div className="text-xs text-primary-800">
      <span className="font-semibold">TBD — Architecture Decision: </span>
        {children}
      </div>
    </div>
  );
}

// Loading Spinner
export function LoadingSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600" />
      <p className="text-sm text-neutral-500">{label}</p>
    </div>
  );
}

// Empty State
export function EmptyState({ icon, title, message }: { icon?: ReactNode; title: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      {icon && <span className="text-neutral-300">{icon}</span>}
      <p className="text-sm font-medium text-neutral-600">{title}</p>
      <p className="text-xs text-neutral-400">{message}</p>
    </div>
  );
}

// Status Badge for document status
export function StatusBadge({ status }: { status: 'present' | 'missing' | 'disputed' }) {
  const map = {
    present: { cls: 'badge-success', label: 'Present' },
    missing: { cls: 'badge-error', label: 'Missing' },
    disputed: { cls: 'badge-warning', label: 'Disputed' },
  };
  const { cls, label } = map[status];
  return <span className={cls}>{label}</span>;
}

// Doc Row Status Badge
export function DocRowBadge({ status }: { status: 'active' | 'disputed' | 'deleted' }) {
  const map = {
    active: { cls: 'badge-success', label: 'Active' },
    disputed: { cls: 'badge-warning', label: 'Disputed' },
    deleted: { cls: 'badge-neutral', label: 'Deleted' },
  };
  const { cls, label } = map[status];
  return <span className={cls}>{label}</span>;
}

// Audit Log Indicator
export function AuditIndicator({ action }: { action: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-neutral-400">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-success-400" />
      <span>Audit logged: {action}</span>
    </div>
  );
}
