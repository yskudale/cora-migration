import React, { HTMLAttributes, ReactNode } from 'react';
import { AppLabel } from './AppLabel';

export interface AppFormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  required?: boolean;
  orientation?: 'horizontal' | 'vertical';
  labelWidth?: string;
  children?: ReactNode;
}

export const AppFormField: React.FC<AppFormFieldProps> = ({ 
  label, 
  required = false, 
  orientation = 'horizontal', 
  labelWidth = 'w-24',
  children, 
  className = '',
  ...props 
}) => {
  if (orientation === 'vertical') {
    return (
      <div className={`flex flex-col gap-1 ${className}`} {...props}>
        {label && (
          <AppLabel variant={required ? 'required' : 'default'}>
            {label}{required && ' *'}
          </AppLabel>
        )}
        {children}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`} {...props}>
      {label && (
        <div className={`shrink-0 ${labelWidth}`}>
          <AppLabel variant={required ? 'required' : 'default'}>
            {label}{required && ' *'}
          </AppLabel>
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
};