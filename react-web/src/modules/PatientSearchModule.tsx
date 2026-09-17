import React, { useState } from 'react';
import { AppModal } from '../components/Layout/AppModal';
import { AppButton } from '../components/Button/AppButton';
import { AppInput } from '../components/Layout/AppInput';

export const PatientSearchModule = ({ onClose }) => {
  const queryParams = new URLSearchParams(window.location.search);
  const initialPatientId = queryParams.get('patientId') || '';

  const [searchTerm, setSearchTerm] = useState(initialPatientId);

  return (
    <AppModal title="Patient Search Module" onClose={onClose}>
      <div className="space-y-4 text-slate-700">
        <p className="text-sm">Enter patient name or ID to search records:</p>
        
        <div className="flex gap-2">
          <AppInput 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient..." 
            className="flex-1"
          />
          <AppButton onClick={() => alert(`Searching for: ${searchTerm}`)}>Search</AppButton>
        </div>

        <div className="border border-slate-200 rounded-lg p-8 text-center text-slate-400 text-xs bg-slate-50">
          {searchTerm ? `[ Displaying search results for ID: ${searchTerm} ]` : '[ Patient Results Table ]'}
        </div>
      </div>
    </AppModal>
  );
};