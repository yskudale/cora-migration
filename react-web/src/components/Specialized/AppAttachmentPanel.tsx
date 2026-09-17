import React, { FieldsetHTMLAttributes } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { AppFieldset } from '../Layout/AppFieldset';
import { AppButton } from '../Button/AppButton';

export type AttachmentItem = { name: string } | string;

export interface AppAttachmentPanelProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  attachments?: AttachmentItem[];
  onAttachFile?: () => void;
  onRemoveAttachment?: (index: number) => void;
  className?: string;
}

export const AppAttachmentPanel: React.FC<AppAttachmentPanelProps> = ({ 
  attachments = [], 
  onAttachFile, 
  onRemoveAttachment,
  className = '',
  ...props 
}) => {
  const { theme } = useTheme();

  if (theme === 'windows') {
    return (
      <AppFieldset legend="Attachments" className={className} {...props}>
        <div className="space-y-2 pt-1">
          <div className="h-20 bg-white border border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff] shadow-[inset_1px_1px_0px_#404040] overflow-y-auto p-1 text-[11px] font-sans">
            {attachments.length === 0 ? (
              <span className="text-gray-400 italic">No attachments added</span>
            ) : (
              <ul className="space-y-1">
                {attachments.map((file, idx) => {
                  const fileName = typeof file === 'string' ? file : file.name;
                  return (
                    <li key={idx} className="flex justify-between items-center hover:bg-[#000080] hover:text-white px-1">
                      <span>📎 {fileName}</span>
                      {onRemoveAttachment && (
                        <button 
                          type="button" 
                          onClick={() => onRemoveAttachment(idx)}
                          className="text-red-700 font-bold hover:text-white px-1"
                        >
                          ✕
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="flex justify-start">
            <AppButton onClick={onAttachFile}>Attach File...</AppButton>
          </div>
        </div>
      </AppFieldset>
    );
  }

  return (
    <AppFieldset legend="Attachments" className={className} {...props}>
      <div className="space-y-3 pt-1">
        <div className="h-24 bg-white border border-slate-200 rounded-lg overflow-y-auto p-2 text-xs">
          {attachments.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400">
              No attachments added
            </div>
          ) : (
            <ul className="space-y-1">
              {attachments.map((file, idx) => {
                const fileName = typeof file === 'string' ? file : file.name;
                return (
                  <li key={idx} className="flex justify-between items-center p-1.5 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-700 font-medium">📎 {fileName}</span>
                    {onRemoveAttachment && (
                      <button 
                        type="button" 
                        onClick={() => onRemoveAttachment(idx)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-0.5"
                      >
                        ✕
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="flex justify-start">
          <AppButton onClick={onAttachFile}>Attach File...</AppButton>
        </div>
      </div>
    </AppFieldset>
  );
};