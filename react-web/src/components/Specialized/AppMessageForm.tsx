import React, { useState, HTMLAttributes, ChangeEvent } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { AppFormField } from '../Form/AppFormField';
import { AppInput } from '../Form/AppInput';
import { AppTextArea } from '../Form/AppTextArea';
import { AppPriorityRadioGroup } from './AppPriorityRadioGroup';
import { AppAttachmentPanel, AttachmentItem } from './AppAttachmentPanel';
import { AppFieldset } from '../Layout/AppFieldset';
import { AppButton } from '../Button/AppButton';

export interface MessageFormData {
  toField: string;
  fromField: string;
  admissionField: string;
  subjectField: string;
  itemRequestedField: string;
  priority: string;
  message: string;
  replyFrom: string;
  reply: string;
  attachments: AttachmentItem[];
}

export interface AppMessageFormProps extends HTMLAttributes<HTMLDivElement> {
  initialTo?: string;
  initialAdmission?: string;
  onSend?: (data: MessageFormData) => void;
  onCancel?: () => void;
  onPrint?: () => void;
  className?: string;
}

export const AppMessageForm: React.FC<AppMessageFormProps> = ({ 
  initialTo = 'ykudale Group-Apopka',
  initialAdmission = 'Request for Info: SYS1612398 Brandon Refstat Test',
  onSend, 
  onCancel, 
  onPrint,
  className = '',
  ...props 
}) => {
  const { theme } = useTheme();

  const [toField, setToField] = useState<string>(initialTo);
  const [fromField, setFromField] = useState<string>('');
  const [admissionField, setAdmissionField] = useState<string>(initialAdmission);
  const [subjectField, setSubjectField] = useState<string>('');
  const [itemRequestedField, setItemRequestedField] = useState<string>('');
  const [priority, setPriority] = useState<string>('High');
  const [message, setMessage] = useState<string>('');
  const [replyFrom, setReplyFrom] = useState<string>('');
  const [reply, setReply] = useState<string>('');
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);

  const handleAttach = () => {
    const fileName = prompt('Enter attachment file name:');
    if (fileName) {
      setAttachments([...attachments, { name: fileName }]);
    }
  };

  const handleRemoveAttach = (idx: number) => {
    setAttachments(attachments.filter((_, i) => i !== idx));
  };

  return (
    <div className={`space-y-3 ${theme === 'windows' ? 'font-sans text-[11px] text-black bg-[#D4D0C8] p-2' : 'text-xs text-slate-800'} ${className}`} {...props}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <AppFormField label="To:">
          <AppInput value={toField} onChange={(e: ChangeEvent<HTMLInputElement>) => setToField(e.target.value)} className="w-full" />
        </AppFormField>

        <AppFormField label="From:">
          <AppInput value={fromField} onChange={(e: ChangeEvent<HTMLInputElement>) => setFromField(e.target.value)} className="w-full" />
        </AppFormField>

        <AppFormField label="Admission:">
          <AppInput value={admissionField} onChange={(e: ChangeEvent<HTMLInputElement>) => setAdmissionField(e.target.value)} className="w-full" />
        </AppFormField>

        <AppFormField label="Subject:">
          <AppInput value={subjectField} onChange={(e: ChangeEvent<HTMLInputElement>) => setSubjectField(e.target.value)} className="w-full" />
        </AppFormField>

        <AppFormField label="Item Requested:">
          <AppInput value={itemRequestedField} onChange={(e: ChangeEvent<HTMLInputElement>) => setItemRequestedField(e.target.value)} className="w-full" />
        </AppFormField>

        <AppPriorityRadioGroup value={priority} onChange={setPriority} />
      </div>

      <AppFieldset legend="Message">
        <AppTextArea 
          value={message} 
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)} 
          rows={4} 
          className="w-full" 
        />
      </AppFieldset>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <AppFormField label="Reply From:">
          <AppInput value={replyFrom} onChange={(e: ChangeEvent<HTMLInputElement>) => setReplyFrom(e.target.value)} className="w-full" />
        </AppFormField>
      </div>

      <AppFieldset legend="Reply">
        <AppTextArea 
          value={reply} 
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setReply(e.target.value)} 
          rows={3} 
          className="w-full" 
        />
      </AppFieldset>

      <AppAttachmentPanel 
        attachments={attachments} 
        onAttachFile={handleAttach}
        onRemoveAttachment={handleRemoveAttach}
      />

      <div className="flex justify-between items-center pt-2">
        <AppButton onClick={onPrint}>Print</AppButton>
        <div className="flex gap-2">
          <AppButton 
            onClick={() => onSend && onSend({ toField, fromField, admissionField, subjectField, itemRequestedField, priority, message, replyFrom, reply, attachments })}
          >
            Send
          </AppButton>
          <AppButton onClick={onCancel}>Cancel</AppButton>
        </div>
      </div>
    </div>
  );
};