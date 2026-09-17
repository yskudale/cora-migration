import React, { ChangeEvent } from 'react';
import { AppInput, AppInputProps } from './AppInput';
import { AppIconButton } from '../Button/AppIconButton';

export interface AppDateFieldProps extends Omit<AppInputProps, 'onChange'> {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onCalendarClick?: () => void;
}

export const AppDateField: React.FC<AppDateFieldProps> = ({ 
  value, 
  onChange, 
  onCalendarClick, 
  placeholder = 'MM/DD/YYYY',
  variant = 'default',
  readOnly = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <AppInput
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        variant={variant}
        readOnly={readOnly}
        disabled={disabled}
        className="w-full"
        {...props}
      />
      <AppIconButton
        icon="📅"
        title="Open Calendar"
        onClick={onCalendarClick}
        disabled={disabled}
      />
    </div>
  );
};