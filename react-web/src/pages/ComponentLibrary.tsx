import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

// 1. Buttons
import { AppButton } from '../components/Button/AppButton';
import { AppIconButton } from '../components/Button/AppIconButton';

// 2. Form Controls
import { AppLabel } from '../components/Form/AppLabel';
import { AppInput } from '../components/Form/AppInput';
import { AppTextArea } from '../components/Form/AppTextArea';
import { AppSelect } from '../components/Form/AppSelect';
import { AppCheckbox } from '../components/Form/AppCheckbox';
import { AppRadioButton } from '../components/Form/AppRadioButton';
import { AppFormField } from '../components/Form/AppFormField';
import { AppDateField } from '../components/Form/AppDateField';
import { AppSearchBox } from '../components/Form/AppSearchBox';
import { AppColorSwatch } from '../components/Form/AppColorSwatch';

// 3. Layout & Containers
import { AppFieldset } from '../components/Layout/AppFieldset';
import { AppModal } from '../components/Layout/AppModal';

// 4. Navigation
import { AppTabs } from '../components/Navigation/AppTabs';
import { AppTab } from '../components/Navigation/AppTab';
import { AppVerticalTabList } from '../components/Navigation/AppVerticalTabList';
import { AppVerticalMenu } from '../components/Navigation/AppVerticalMenu';
import { AppRecordNavBar } from '../components/Navigation/AppRecordNavBar';

// 5. Data Display
import { AppCalendar } from '../components/DataDisplay/AppCalendar';
import { AppSlider } from '../components/DataDisplay/AppSlider';
import { AppStatusText } from '../components/DataDisplay/AppStatusText';
import { AppPatientInfoLabel } from '../components/DataDisplay/AppPatientInfoLabel';
import { AppDataTable } from '../components/DataDisplay/AppDataTable';

// 6. Specialized Modules
import { AppPriorityRadioGroup } from '../components/Specialized/AppPriorityRadioGroup';
import { AppAttachmentPanel } from '../components/Specialized/AppAttachmentPanel';
import { AppMessageForm } from '../components/Specialized/AppMessageForm';

export const ComponentLibrary = () => {
  const { theme, toggleTheme } = useTheme();

  // Interactive component state
  const [inputValue, setInputValue] = useState('Brandon RefstatTest');
  const [dateValue, setDateValue] = useState('09/16/2026');
  const [searchValue, setSearchValue] = useState('');
  const [checkboxState, setCheckboxState] = useState(true);
  const [radioValue, setRadioValue] = useState('Active');
  const [selectValue, setSelectValue] = useState('General Rehab');
  const [sliderValue, setSliderValue] = useState(40);
  const [activeTab, setActiveTab] = useState('Admission Details');
  const [verticalTab, setVerticalTab] = useState('1');
  const [navIndex, setNavIndex] = useState(14);
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [priorityValue, setPriorityValue] = useState('High');
  const [attachments, setAttachments] = useState([{ name: 'Physician_Script.pdf' }]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Table Data Sample
  const tableHeaders = ['Type', 'Notes', 'Date Added', 'By'];
  const tableData = [
    { type: 'Misc', notes: 'Imported File: 123.pdf', date: '09/15/2026', by: 'McConkey, Reec' },
    { type: 'PT Visit', notes: 'Initial Evaluation.pdf', date: '09/16/2026', by: 'Gonzales, Pilar' },
    { type: 'RX', notes: 'Script Document.pdf', date: '09/10/2026', by: 'Raab, David' }
  ];

  const panelContainerClass = theme === 'windows'
    ? 'bg-[#F0EEEF] border-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] p-4 font-sans text-black'
    : 'bg-white rounded-xl shadow-sm border border-slate-200 p-4';

    const [selectedRow, setSelectedRow] = useState<{ id: string } | null>(null);

  const columns = [
    { key: 'patientName', header: 'Patient Name' },
    { key: 'locationName', header: 'Location Name' },
    { key: 'scheduledFor', header: 'Scheduled for' },
    { key: 'therapist', header: 'Therapist' },
    { key: 'status', header: 'Status' },
    { key: 'startsAt', header: 'Starts at' },
  ];

  const appointmentData = [
    { id: '1', patientName: 'Alba Abbott', locationName: 'Kissimmee', scheduledFor: '10/12/2017', therapist: 'Stewart, Steven', status: 'Complete', startsAt: '11:00 AM' },
    { id: '2', patientName: 'Alba Abbott', locationName: 'Kissimmee', scheduledFor: '10/05/2017', therapist: 'Stewart, Steven', status: 'Complete', startsAt: '10:00 AM' },
    { id: '3', patientName: 'Alba Abbott', locationName: 'Kissimmee', scheduledFor: '09/28/2017', therapist: 'Stewart, Steven', status: 'Cancellation', startsAt: '01:00 PM' },
    { id: '4', patientName: 'Alba Abbott', locationName: 'Kissimmee', scheduledFor: '09/21/2017', therapist: 'Stewart, Steven', status: 'Show', startsAt: '10:00 AM' },
  ];

  return (
    <div className={`min-h-screen p-6 space-y-6 ${theme === 'windows' ? 'bg-[#3A6EA5]' : 'bg-slate-100'}`}>
      
      {/* Header Bar */}
      <div className={`p-4 rounded-lg flex justify-between items-center ${theme === 'windows' ? 'bg-[#F0EEEF] border-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] text-black font-sans' : 'bg-white shadow-sm border border-slate-200'}`}>
        <div>
          <h1 className="text-lg font-bold">UI Component Library Showcase</h1>
          <p className="text-xs opacity-75">Full inventory sandbox for verifying visual fidelity across themes.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold">Active Theme: <span className="uppercase">{theme}</span></span>
          <AppButton onClick={toggleTheme}>Switch Theme</AppButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 1. Buttons & Icon Controls */}
        <div className={panelContainerClass}>
          <h2 className="text-sm font-bold mb-3 border-b pb-1">1. Buttons & Icon Buttons</h2>
          <div className="space-y-4">
            <div>
              <AppLabel variant="bold" className="block mb-2">AppButton Variants:</AppLabel>
              <div className="flex flex-wrap gap-2">
                <AppButton onClick={() => alert('Search')}>Search</AppButton>
                <AppButton icon="💾" onClick={() => alert('Saved')}>Save Record</AppButton>
                <AppButton icon="🔍">Find Patient</AppButton>
              </div>
            </div>

            <div>
              <AppLabel variant="bold" className="block mb-2">AppIconButton Actions & Navigation:</AppLabel>
              <div className="flex flex-wrap items-center gap-1.5">
                <AppIconButton icon="|◄" title="First" />
                <AppIconButton icon="◄" title="Previous" />
                <AppIconButton icon="►" title="Next" />
                <AppIconButton icon="►|" title="Last" />
                <span className="mx-1 text-xs">|</span>
                <AppIconButton icon="☕" title="Java" />
                <AppIconButton icon="📅" title="Calendar" />
                <AppIconButton icon="✕" title="Close" />
                <AppIconButton icon="🚫" title="Disabled" disabled />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Core & Composite Form Controls */}
        <div className={panelContainerClass}>
          <h2 className="text-sm font-bold mb-3 border-b pb-1">2. Core & Composite Form Controls</h2>
          <div className="space-y-3">
            <AppFormField label="Patient Name:" required>
              <AppInput value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full" />
            </AppFormField>

            <AppFormField label="Birth Date:">
              <AppDateField value={dateValue} onChange={(e) => setDateValue(e.target.value)} className="w-full" />
            </AppFormField>

            <AppFormField label="Search Record:">
              <AppSearchBox value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="w-full" />
            </AppFormField>

            <div className="flex items-center justify-between pt-1">
              <AppCheckbox label="Inactive Patient" checked={checkboxState} onChange={(e) => setCheckboxState(e.target.checked)} />
              <AppColorSwatch color="#008000" label="Green Indicator" />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <AppLabel variant="bold">Status:</AppLabel>
              <AppRadioButton name="status" label="Active" value="Active" checked={radioValue === 'Active'} onChange={(e) => setRadioValue(e.target.value)} />
              <AppRadioButton name="status" label="Inactive" value="Inactive" checked={radioValue === 'Inactive'} onChange={(e) => setRadioValue(e.target.value)} />
            </div>

            <AppFormField label="Program Type:">
              <AppSelect value={selectValue} onChange={(e) => setSelectValue(e.target.value)} options={['General Rehab', 'Physical Therapy', 'Occupational Therapy']} className="w-full" />
            </AppFormField>
          </div>
        </div>

        {/* 3. Navigation Components */}
        <div className={panelContainerClass}>
          <h2 className="text-sm font-bold mb-3 border-b pb-1">3. Navigation & Steppers</h2>
          <div className="space-y-4">
            <div>
              <AppLabel variant="bold" className="block mb-2">AppTabs Strip:</AppLabel>
              <AppTabs>
                {['Admission Details', 'Clinical Information', 'Diagnosis Codes'].map((t) => (
                  <AppTab key={t} label={t} active={activeTab === t} onClick={() => setActiveTab(t)} />
                ))}
              </AppTabs>
            </div>

            <div className="flex gap-4 items-center">
              <div>
                <AppLabel variant="bold" className="block mb-2">Vertical Tabs:</AppLabel>
                <AppVerticalTabList tabs={['1', '2', '3', '4']} activeTab={verticalTab} onTabChange={setVerticalTab} />
              </div>

              <div>
                <AppLabel variant="bold" className="block mb-2">Vertical Action Menu:</AppLabel>
                <AppVerticalMenu items={[{ icon: '⭐', title: 'Favorite' }, { icon: 'ℹ️', title: 'Info' }, { icon: '📋', title: 'Copy' }]} />
              </div>
            </div>

            <div>
              <AppLabel variant="bold" className="block mb-2">AppRecordNavBar Stepper Bar:</AppLabel>
              <AppRecordNavBar
                currentIndex={navIndex}
                onFirst={() => setNavIndex(1)}
                onPrev={() => setNavIndex(Math.max(1, navIndex - 1))}
                onNext={() => setNavIndex(navIndex + 1)}
                onLast={() => setNavIndex(99)}
              />
            </div>
          </div>
        </div>

        {/* 4. Data Display Components */}
        <div className={panelContainerClass}>
          <h2 className="text-sm font-bold mb-3 border-b pb-1">4. Data Display Controls</h2>
          <div className="space-y-3">
            <AppPatientInfoLabel sysId="SYS1612398" name="RefstatTest, Brandon" reason="Foot Issue" />
            
            <div className="flex gap-4">
              <AppCalendar selectedDate="Wed, Aug 5, 2026" />
              <div className="flex-1 space-y-3">
                <AppSlider label="Admit Funct Score" value={sliderValue} onChange={(e) => setSliderValue(Number(e.target.value))} />
                <div>
                  <AppLabel variant="bold" className="block mb-1">AppStatusText Variations:</AppLabel>
                  <div className="flex flex-col gap-1">
                    <AppStatusText status="info">Standard status info line.</AppStatusText>
                    <AppStatusText status="error">Warning: Appointment date is in the past.</AppStatusText>
                    <AppStatusText status="success">Verified Insurance Active.</AppStatusText>
                    <AppStatusText status="link" onClick={() => alert('Navigating to history...')}>View Referral History...</AppStatusText>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Data Tables */}
        <div className={`md:col-span-2 ${panelContainerClass}`}>
          <h2 className="text-sm font-bold mb-3 border-b pb-1">5. AppDataTable Component</h2>
          <AppDataTable
            headers={tableHeaders}
            data={tableData}
            selectedIndex={selectedRowIndex}
            onSelectRow={(idx) => setSelectedRowIndex(idx)}
          />
        </div>
<div className={`md:col-span-2 ${panelContainerClass}`}>
      <h2 className="text-lg font-bold mb-4">Patient Appointments (Right-Click Row Test)</h2>
      <AppDataTable
        columns={columns}
        data={appointmentData}
        selectedRowId={selectedRow?.id}
        onSelectRow={(row) => setSelectedRow(row)}
        onSortChange={(field) => console.log('Sort changed to:', field)}
        onRowAction={(action, row) => console.log(`Action: ${action} on Row:`, row)}
        contextMenuItems={[
          {
            id: 'sort_by',
            label: 'Sort by',
            submenu: [
              { id: 'unsorted', label: '<unsorted>', onClick: () => console.log('Sort: unsorted') },
              { id: 'patient', label: 'Patient', onClick: () => console.log('Sort: Patient') },
              { id: 'date', label: 'Date', onClick: () => console.log('Sort: Date') },
            ],
          },
          { type: 'separator' },
          { id: 'post_changes', label: 'Post changes to current row', onClick: () => console.log('Post current row') },
          { id: 'cancel_changes', label: 'Cancel changes to current row', onClick: () => console.log('Cancel current row') },
          { id: 'insert_row', label: 'Insert new row', onClick: () => console.log('Insert new row') },
          { id: 'delete_row', label: 'Delete current row', onClick: () => console.log('Delete current row') },
        ]}
      />
    </div>
        {/* 6. Specialized Business Modules */}
        <div className={`md:col-span-2 ${panelContainerClass}`}>
          <h2 className="text-sm font-bold mb-3 border-b pb-1">6. Specialized Business Modules (AppMessageForm & AppAttachmentPanel)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <AppPriorityRadioGroup value={priorityValue} onChange={setPriorityValue} className="mb-3" />
              <AppAttachmentPanel
                attachments={attachments}
                onAttachFile={() => setAttachments([...attachments, { name: 'New_Attachment.pdf' }])}
                onRemoveAttachment={(idx) => setAttachments(attachments.filter((_, i) => i !== idx))}
              />
            </div>
            <div>
              <AppMessageForm
                onSend={(data) => alert(`Message Sent to ${data.toField}`)}
                onCancel={() => alert('Message Cancelled')}
                onPrint={() => alert('Printing Message...')}
              />
            </div>
          </div>
        </div>

        {/* 7. AppModal Window Trigger */}
        <div className={`md:col-span-2 ${panelContainerClass}`}>
          <h2 className="text-sm font-bold mb-3 border-b pb-1">7. Frame Window Container (AppModal)</h2>
          <AppButton onClick={() => setIsModalOpen(true)} variant="secondary">
            Launch Preview AppModal Frame
          </AppButton>

          {isModalOpen && (
            <AppModal title="Patient Registration Center - SYS1612398" onClose={() => setIsModalOpen(false)}>
              <div className="space-y-3 p-2">
                <p className="text-xs">This is a live preview inside the updated <strong>AppModal</strong> container component.</p>
                <div className="flex justify-end gap-2 pt-2">
                  <AppButton onClick={() => setIsModalOpen(false)}>Close Window</AppButton>
                </div>
              </div>
            </AppModal>
          )}
        </div>

      </div>
    </div>
  );
};