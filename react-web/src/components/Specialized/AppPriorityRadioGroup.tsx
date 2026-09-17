import React, { HTMLAttributes, ChangeEvent, useId } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { AppRadioButton } from '../Form/AppRadioButton';
import { AppLabel } from '../Form/AppLabel';

export interface AppPriorityRadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  onChange?: (val: string) => void;
  name?: string;
  className?: string;
}

export const AppPriorityRadioGroup: React.FC<AppPriorityRadioGroupProps> = ({ 
  value = 'Medium', 
  onChange, 
  name,
  className = '',
  ...props 
}) => {
  const { theme } = useTheme();
  const generatedId = useId();
  const groupName = name || `priority-${generatedId}`;

  const options = [
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' }
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.value);
  };

  if (theme === 'windows') {
    return (
      <div className={`flex items-center gap-3 font-sans text-[11px] text-black ${className}`} {...props}>
        <AppLabel variant="bold">Priority:</AppLabel>
        <div className="flex items-center gap-2">
          {options.map((opt) => (
            <AppRadioButton
              key={opt.value}
              name={groupName}
              label={opt.label}
              value={opt.value}
              checked={value === opt.value}
              onChange={handleChange}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 ${className}`} {...props}>
      <AppLabel variant="bold">Priority</AppLabel>
      <div className="flex items-center gap-3">
        {options.map((opt) => (
          <AppRadioButton
            key={opt.value}
            name={groupName}
            label={opt.label}
            value={opt.value}
            checked={value === opt.value}
            onChange={handleChange}
          />
        ))}
      </div>
    </div>
  );
};