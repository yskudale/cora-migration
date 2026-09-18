import { useEffect, type ReactNode } from 'react';
import { XIcon } from './Icons';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: ReactNode;
}

const sizeMap = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({ open, onClose, title, subtitle, children, footer, size = 'md', icon }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className={`modal-panel ${sizeMap[size]}`} onClick={(e) => e.stopPropagation()}>
        {/* Windows-style title bar */}
        <div className="modal-header">
          <div className="flex items-center gap-2">
            {icon && <span className="text-white">{icon}</span>}
            <div>
              <span className="text-xs font-semibold text-white">{title}</span>
              {subtitle && <span className="ml-2 text-xs text-white/70">— {subtitle}</span>}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-5 w-5 items-center justify-center text-white transition-colors hover:bg-error-500"
            style={{ border: '1px solid transparent', fontSize: '11px' }}
          >
            <XIcon size={14} />
          </button>
        </div>
        <div className="modal-body max-h-[60vh] overflow-y-auto">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
