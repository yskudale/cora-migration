import React, { HTMLAttributes, ChangeEvent, KeyboardEvent, ReactNode } from 'react';
import { AppInput } from './AppInput';
import { AppButton } from '../Button/AppButton';

export interface AppSearchBoxProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearch?: (val: string) => void;
  placeholder?: string;
  buttonLabel?: string;
  icon?: ReactNode;
}

export const AppSearchBox: React.FC<AppSearchBoxProps> = ({ 
  value = '', 
  onChange, 
  onSearch, 
  placeholder = 'Search...', 
  buttonLabel = 'Search',
  icon = '🔍',
  className = '',
  ...props 
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`} {...props}>
      <AppInput
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1"
      />
      <AppButton icon={icon} onClick={() => onSearch && onSearch(value)}>
        {buttonLabel}
      </AppButton>
    </div>
  );
};