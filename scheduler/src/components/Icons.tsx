import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 18, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...props,
  };
}

export const ScanIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10" /></svg>
);

export const UploadIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
);

export const EyeIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
);

export const PrintIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z" /></svg>
);

export const MailIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></svg>
);

export const EditIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
);

export const TrashIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" /></svg>
);

export const AlertIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" /></svg>
);

export const RefreshIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M3 21v-5h5" /></svg>
);

export const FileTextIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>
);

export const CheckCircleIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3" /></svg>
);

export const XCircleIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" /></svg>
);

export const XIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M18 6 6 18M6 6l12 12" /></svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>
);

export const SettingsIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
);

export const ShieldIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);

export const InfoIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
);

export const ClipboardListIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0-2 2v0M9 5a2 2 0 0 1 2 2v0M15 11h-4M15 15h-4M15 8h-1" /></svg>
);

export const StethoscopeIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M11 2v2M5 2v2M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1M8 15a6 6 0 0 0 12 0v-3M20 12h-4M20 12v.01" /></svg>
);

export const DollarIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
);

export const SendIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m22 2-7 20-4-9-9-4ZM22 2 11 13" /></svg>
);

export const LoaderIcon = (p: IconProps) => (
  <svg {...base(p)} className={`animate-spin ${p.className || ''}`}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);

export const LockIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);

export const MenuIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 6h16M4 12h16M4 18h16" /></svg>
);

export const ArrowLeftIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m12 19-7-7 7-7M19 12H5" /></svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
);

export const FileCheckIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6M9 15l2 2 4-4" /></svg>
);

export const TagIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.42 0l8.58-8.58a1 1 0 0 0 0-1.42L12 2zM7 7h.01" /></svg>
);

export const HelpCircleIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" /></svg>
);

export const LayersIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m12 2 9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5" /></svg>
);

export const MonitorIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
);

export const CalendarIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="3" y="4" width="18" height="17" rx="1" /><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" /></svg>
);

export const PlusIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>
);

export const PrinterIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z" /></svg>
);

export const SearchIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
);

export const UserIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);
