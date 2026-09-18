import React, { useState } from 'react';

const clinicians = [
  'IBST Miscellaneous, PT', 'David Alexy, PT', 'Ibrar Ali, PT', 'Cynthia Casaudomecq, SLP',
  'Monica Chitta, PT', 'Alfred Georgi, PTA', 'Hayley Goodman, PT', 'Lisa Grant, PT',
  'Jacob Hartman, PT', 'Lisa Kalikta, PT', 'Nouman Khan, PT', 'Syed Khizer, PT',
  'Steven Kiak, PT', 'Neetika Kumar, PT', 'Hunt, PT',
];

const times = [
  '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM',
];

// Appointment blocks with status colors and contract type dot indicators
const appointments = [
  { 
    clinician: 2, 
    row: 6, 
    name: 'Young, Melissa', 
    type: 'RTM', 
    statusColor: 'bg-[#ffcb99]', // Scheduled Peach / Light Orange
    contractDots: ['bg-[#008000]', 'bg-[#409fff]', 'bg-[#a582ec]'] // Medicare, Flat Rate, Other
  },
  { 
    clinician: 7, 
    row: 6, 
    name: 'RefstatTest3 Bra...', 
    type: 'RTM', 
    statusColor: 'bg-[#ffcb99]',
    contractDots: ['bg-[#008000]', 'bg-[#ff0000]'] 
  },
  { 
    clinician: 7, 
    row: 8, 
    name: 'ReferralTester Br...', 
    type: '', 
    statusColor: 'bg-[#ffcb99]',
    contractDots: ['bg-[#008000]'] 
  },
];

const blocks = [
  { clinician: 1, row: 0, span: 4, text: 'TH 8-5' }, 
  { clinician: 1, row: 2, span: 3, text: 'Blocked' },
  { clinician: 1, row: 10, span: 2, text: 'Lunch' }, 
  { clinician: 4, row: 0, span: 4, text: '8-9pm' },
  { clinician: 5, row: 0, span: 4, text: '9-6' }, 
  { clinician: 6, row: 0, span: 4, text: '8-5' },
  { clinician: 4, row: 12, span: 2, text: 'Lunch' }, 
  { clinician: 5, row: 12, span: 2, text: 'Lunch' },
  { clinician: 6, row: 12, span: 2, text: 'LUNCH' }, 
  { clinician: 7, row: 10, span: 4, text: 'Block' },
  { clinician: 13, row: 0, span: 4, text: 'TELE EVAL ONLY...' }, 
  { clinician: 13, row: 10, span: 5, text: 'CLOSED' },
];

// Exact 24 Toolbar Button Definitions
const toolbarButtons = [
  { icon: '❌', tooltip: 'Exit Scheduler', color: 'text-red-600' },
  { icon: '🌱', tooltip: 'Referrals', color: 'text-green-600' },
  { icon: '📋', tooltip: 'PAIR Work Queue', color: 'text-emerald-700' },
  { icon: '🔍', tooltip: 'Patient Search', color: 'text-blue-700' },
  { icon: '🏷️', tooltip: 'Authorizations', color: 'text-amber-700' },
  { icon: '📦', tooltip: 'Patient Intake', color: 'text-stone-700' },
  { icon: '👥', tooltip: 'Check In / Check Out', color: 'text-sky-700' },
  { icon: '💳', tooltip: 'Payment / Collect', color: 'text-green-700' },
  { icon: '💰', tooltip: 'Billing Ledger', color: 'text-amber-600' },
  { icon: '📝', tooltip: 'Clinical Notes', color: 'text-blue-800' },
  { icon: '🅿️', tooltip: 'Pay Later Queue', color: 'text-blue-600' },
  { icon: '⭐', tooltip: 'Favorites', color: 'text-purple-700' },
  { icon: '✂️', tooltip: 'Cut / Reschedule', color: 'text-red-700' },
  { icon: '⏰', tooltip: 'Appointment History', color: 'text-stone-800' },
  { icon: '🔄', tooltip: 'Refresh Schedule', color: 'text-blue-700' },
  { icon: '⚠️', tooltip: 'Alerts & Messages', color: 'text-amber-600' },
  { icon: 'ℹ️', tooltip: 'Schedule Info', color: 'text-indigo-800' },
];

export const SchedulerMain = () => {
  const [selectedDate, setSelectedDate] = useState(17);
  const [selectedClinicians, setSelectedClinicians] = useState(clinicians.slice(0, 15));
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [dialog, setDialog] = useState<'appointment' | 'registration' | 'edocs' | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<{ name: string; clinician: number; row: number } | null>(null);

  const toggleClinician = (clinician: string) => {
    setSelectedClinicians((current) =>
      current.includes(clinician)
        ? current.filter((item) => item !== clinician)
        : [...current, clinician]
    );
  };

  const openAppointmentDialog = (appointment?: { name: string; clinician: number; row: number }) => {
    setSelectedAppointment(appointment ?? { name: 'Search patient', clinician: 0, row: 0 });
    setDialog('appointment');
    setContextMenu(null);
  };

  const handleGridContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({ x: event.clientX, y: event.clientY });
  };

  return (
    <main className="h-screen w-screen min-w-[1120px] overflow-hidden bg-[#f0eeeef0] font-sans text-[11px] text-black select-none" onClick={() => setContextMenu(null)}>
      
      {/* Window Title Bar */}
      <header className="box-border flex h-[24px] items-center justify-between border-b border-[#808080] bg-[#f0eeef] px-2 text-[12px] font-bold">
        <span>CORA DEV - Scheduling for -- Apopka - CORA</span>
        <div className="flex items-center gap-2 font-normal">
          <button className="h-4 w-4 bg-[#e0e0e0] border border-[#808080] text-[10px] leading-none">_</button>
          <button className="h-4 w-4 bg-[#e0e0e0] border border-[#808080] text-[10px] leading-none">☐</button>
          <button className="h-4 w-4 bg-[#e0e0e0] border border-[#808080] text-[10px] leading-none text-red-600">✕</button>
        </div>
      </header>

      {/* Navigation Menu Strip */}
      <nav className="flex h-[22px] items-center gap-0.5 border-b border-[#a0a0a0] bg-[#f4f4f4] px-1 text-[11px]">
        {['File', 'Edit', 'View', 'Reports', 'Scan', 'Help', 'Appointment Tools'].map((item) => (
          <button className="px-1.5 py-0.5 hover:bg-[#316ac5] hover:text-white" key={item}>
            {item}
          </button>
        ))}
      </nav>

      {/* Toolbar (NORTH - Row 1) */}
      <div className="flex h-[36px] items-center gap-1 border-b border-[#808080] bg-gradient-to-b from-[#ffffff] via-[#f0f0f0] to-[#d4d0c8] px-1">
        {toolbarButtons.map((btn, idx) => (
          <button
            key={idx}
            title={btn.tooltip}
            className={`h-7 w-7 flex items-center justify-center border border-[#7f9db9] bg-gradient-to-b from-[#ffffff] to-[#d4d0c8] text-[13px] shadow-[inset_1px_1px_0px_#ffffff] active:border-t-[#404040] active:border-l-[#404040] ${btn.color}`}
          >
            {btn.icon}
          </button>
        ))}

        {/* Playbook Buttons */}
        <div className="ml-auto flex items-center gap-1">
          <button 
            title="Labor Playbook"
            className="h-7 px-1.5 bg-[rgb(40,134,188)] text-white text-[10px] font-bold border border-[#004080] rounded-xs shadow-xs"
          >
            LaborPB
          </button>
          
          {/* Daily & Weekly Efficiency Indicator Dots */}
          <div className="flex items-center gap-1 ml-1 px-1">
            <span className="h-3 w-3 rounded-full bg-emerald-500 border border-emerald-700 inline-block" title="Daily Efficiency Indicator" />
            <span className="h-3 w-3 rounded-full bg-purple-600 border border-purple-800 inline-block" title="Weekly Efficiency Indicator" />
          </div>
        </div>
      </div>

      {/* Stats Bar (NORTH - Row 2) */}
      <section className="flex h-[24px] items-center gap-3 whitespace-nowrap border-b border-[#808080] bg-[#f0eeef] px-2 text-[11px]">
        <span>Targeted Weekly Appts: <strong className="font-bold">417.49</strong></span>
        <span>Actual Weekly Appts: <strong className="font-bold">4</strong></span>
        <span>Weekly Visits: <strong className="font-bold">0</strong></span>
        <span>Outstanding Appts: <strong className="font-bold">4</strong></span>
        <span>Wk TH-Evals(goal): <strong className="font-bold">0 (0.00)</strong></span>
        <span className="text-[14px] text-[#0078d7] cursor-pointer">●</span>
        <span>Daily Appts: <strong className="font-bold">3</strong></span>
        <span>Weekly Evals: <strong className="font-bold">0</strong></span>
        
        <button className="ml-auto font-bold text-[#0000d0] underline hover:text-blue-800">
          Show/Refresh Hrs
        </button>
        
        <div className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
          <span className="h-2.5 w-2.5 rounded-full bg-purple-600 inline-block" />
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="grid h-[calc(100vh-135px)] grid-cols-[185px_1fr_185px]">
        
        {/* Left Panel (WEST) */}
        <aside className="overflow-y-auto border-r border-[#808080] bg-[#f0eeef] p-1 flex flex-col gap-1">
          
          {/* Mini Calendar */}
          <div className="border border-[#7f9db9] bg-white">
            <div className="flex h-[20px] items-center justify-between bg-gradient-to-b from-[#d9e8f5] to-[#c2d9ee] px-1 font-bold text-[#003366]">
              <button className="px-1 text-[10px] hover:bg-blue-200">&lt;</button>
              <span>Sep 2026</span>
              <button className="px-1 text-[10px] hover:bg-blue-200">&gt;</button>
            </div>
            
            <div className="p-1">
              <div className="grid grid-cols-7 text-center text-[10px] font-bold text-[#003366] mb-0.5">
                <span>Sun</span><span>Mon</span><span>Tue</span><span>W...</span><span>Thu</span><span>Fri</span><span>Sat</span>
              </div>
              <div className="grid grid-cols-7 text-center">
                {Array.from({ length: 30 }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(index + 1)}
                    className={`h-[18px] text-[10px] font-sans hover:bg-[#d4d0c8] ${
                      index + 1 === selectedDate ? 'bg-[#0078d7] text-white font-bold' : ''
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Action Navigation */}
            <div className="flex justify-between border-t border-[#808080] bg-[#e0e0e0] p-0.5 text-[10px]">
              {['Previous', 'Today', 'Next'].map((lbl) => (
                <button key={lbl} className="px-1 border border-[#808080] bg-white hover:bg-gray-100">
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Therapist Selector List */}
          <div className="border border-[#7f9db9] bg-white p-1 flex-1 min-h-[140px] overflow-y-auto text-[10px]">
            {clinicians.map((clinician) => (
              <label key={clinician} className="flex items-center gap-1 leading-tight py-0.5 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={selectedClinicians.includes(clinician)}
                  onChange={() => toggleClinician(clinician)}
                  className="h-3 w-3 rounded-none border-[#808080]"
                />
                <span className="truncate">{clinician}</span>
              </label>
            ))}
          </div>

          {/* Select Controls */}
          <div className="flex justify-between px-1 text-[10px]">
            <button onClick={() => setSelectedClinicians(clinicians)} className="text-[#0000d0] underline font-bold">
              Select All
            </button>
            <button onClick={() => setSelectedClinicians([])} className="text-[#0000d0] underline font-bold">
              Clear All
            </button>
          </div>
          
          <button className="text-center text-[10px] text-[#0000d0] underline font-bold">
            Add All DHS
          </button>

          {/* Patient / Appt. Info Inset Box */}
          <div className="border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white bg-white p-1 min-h-[100px]">
            <div className="font-bold border-b border-[#808080] pb-0.5 mb-1 text-[10px]">
              Patient/Appt. Info
            </div>
            <div className="text-[10px] text-gray-600">
              No Appointment Selected
            </div>
          </div>
        </aside>

        {/* Main Schedule Grid (CENTER) */}
        <section className="overflow-auto bg-white">
          <div className="min-w-[1450px]">
            
            {/* Therapist Headers with Light Green Tops */}
            <div className="grid h-[28px] grid-cols-[65px_repeat(15,minmax(90px,1fr))] border-b border-[#808080]">
              <div className="border-r border-[#808080] bg-[#e0e0e0]" />
              {clinicians.map((clinician) => (
                <div
                  key={clinician}
                  className="border-r border-[#808080] bg-[#d2ebd0] px-1 py-0.5 text-[10px] font-bold truncate text-center text-slate-800"
                >
                  {clinician}
                </div>
              ))}
            </div>

            {/* Time Grid Matrix */}
            <div className="grid grid-cols-[65px_1fr]">
              
              {/* Time Column */}
              <div className="grid grid-rows-[repeat(19,minmax(24px,1fr))] border-r border-[#808080] bg-[#f4f4f4]">
                {times.map((t) => (
                  <div key={t} className="border-b border-[#c0c0c0] pr-1 pt-0.5 text-right font-mono text-[10px] text-gray-700">
                    {t}
                  </div>
                ))}
              </div>

              {/* Schedule Canvas */}
              <div
                className="relative grid grid-cols-[repeat(15,minmax(90px,1fr))] grid-rows-[repeat(19,minmax(24px,1fr))] bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_23px,#d0d0d0_23px,#d0d0d0_24px)]"
                onContextMenu={handleGridContextMenu}
              >
                
                {/* Column Separator Lines */}
                {clinicians.map((_, i) => (
                  <div key={i} className="row-span-full border-r border-[#a0a0a0]" />
                ))}

                {/* Gray Schedule Blocks */}
                {blocks.map((b, idx) => (
                  <div
                    key={idx}
                    className="z-10 m-0.5 border border-[#808080] bg-[#d0d0d0] p-0.5 text-[10px] text-black font-semibold truncate"
                    style={{
                      gridColumn: b.clinician + 1,
                      gridRow: `${b.row + 1} / span ${b.span}`
                    }}
                  >
                    {b.text}
                  </div>
                ))}

                {/* Interactive Appointment Cards */}
                {appointments.map((app, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`z-20 m-0.5 border border-[#808080] ${app.statusColor} p-1 text-left text-[10px] shadow-xs cursor-pointer flex flex-col justify-between`}
                    style={{
                      gridColumn: app.clinician + 1,
                      gridRow: `${app.row + 1} / span 2`
                    }}
                    onClick={() => openAppointmentDialog(app)}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setSelectedAppointment(app);
                      setContextMenu({ x: event.clientX, y: event.clientY });
                    }}
                  >
                    <span className="font-bold truncate text-black">{app.name}</span>
                    
                    {/* Inline Contract Type Dots & Badges */}
                    <div className="flex items-center gap-1 mt-0.5">
                      {app.contractDots.map((dotColor, dIdx) => (
                        <span key={dIdx} className={`h-2 w-2 rounded-full ${dotColor} inline-block`} />
                      ))}
                      <span className="text-[9px] font-bold text-red-700 ml-auto">✂️ ✓ ✕</span>
                    </div>
                  </button>
                ))}

              </div>
            </div>

          </div>
        </section>

        {/* Right Panel (EAST - PSC/Check-In) */}
        <aside className="border-l border-[#808080] bg-[#f0eeef] p-1 flex flex-col gap-2">
          <div className="font-bold border-b border-[#808080] pb-1 text-[11px]">
            Check-In / Pay Later
          </div>

          {/* Action Cards */}
          <div className="space-y-1.5">
            {/* Pay Later Panel */}
            <div className="border border-[#7f9db9] bg-white p-1 rounded-xs flex items-center gap-1.5 shadow-xs">
              <span className="border border-[#7f9db9] bg-[#e0e0e0] px-1 py-0.5 font-bold text-[#0078d7] text-[10px]">
                +&gt;
              </span>
              <span className="text-[10px] font-medium">10:00 AM Young, Melissa</span>
            </div>

            {/* AI Consent Panel */}
            <div className="border border-[#7f9db9] bg-white p-1 rounded-xs flex items-center gap-1.5 shadow-xs">
              <span className="font-extrabold text-red-600 text-[12px] tracking-tighter">
                AI
              </span>
              <span className="text-[10px] font-medium">10:00 AM Young, Melissa</span>
            </div>
          </div>
        </aside>

      </div>

      {/* Footer (SOUTH) */}
      <footer className="flex h-[24px] items-center justify-between border-t border-[#808080] bg-[#f0eeef] px-2 text-[10px]">
        {/* User Info & Location */}
        <div className="flex items-center gap-4">
          <span className="border border-[#808080] bg-white px-1.5 py-0.5">8809, Yogesh Kudale</span>
          <span className="border border-[#808080] bg-white px-1.5 py-0.5">Apopka - CORA</span>
        </div>

        {/* Version Badge */}
        <div className="border border-[#004080] bg-[rgb(40,134,188)] text-white font-bold px-2 py-0.5">
          Jan 1 1970 BETA 5.10.7.0
        </div>

        {/* Color Legend Strip */}
        <div className="flex items-center gap-2 font-medium">
          <span className="flex items-center gap-1">
            <i className="h-2.5 w-2.5 border border-[#808080] bg-[rgb(153,204,255)] inline-block" />
            Scheduled
          </span>
          <span className="flex items-center gap-1">
            <i className="h-2.5 w-2.5 border border-[#808080] bg-[rgb(163,240,201)] inline-block" />
            Checked In
          </span>
          <span className="flex items-center gap-1">
            <i className="h-2.5 w-2.5 border border-[#808080] bg-[#a582ec] inline-block" />
            Complete
          </span>
          <span className="flex items-center gap-1">
            <i className="h-2.5 w-2.5 border border-[#808080] bg-[#f2c796] inline-block" />
            Overdue
          </span>
          <span className="flex items-center gap-1">
            <i className="h-2.5 w-2.5 border border-[#808080] bg-[rgb(255,153,204)] inline-block" />
            Cancel/No Show/Rescheduled
          </span>
        </div>
      </footer>

      {contextMenu && (
        <ContextMenu
          position={contextMenu}
          onClose={() => setContextMenu(null)}
          onAppointment={() => openAppointmentDialog(selectedAppointment ?? undefined)}
          onPatient={() => { setDialog('registration'); setContextMenu(null); }}
          onEdocs={() => { setDialog('edocs'); setContextMenu(null); }}
        />
      )}

      {dialog === 'appointment' && (
        <AppointmentDialog
          appointment={selectedAppointment ?? { name: 'Search patient', clinician: 0, row: 0 }}
          onClose={() => setDialog(null)}
          onEdocs={() => setDialog('edocs')}
        />
      )}

      {dialog === 'registration' && <RegistrationDialog onClose={() => setDialog(null)} />}
      {dialog === 'edocs' && <EdocsDialog onClose={() => setDialog(null)} />}
    </main>
  );
};

function ContextMenu({
  position,
  onClose,
  onAppointment,
  onPatient,
  onEdocs,
}: {
  position: { x: number; y: number };
  onClose: () => void;
  onAppointment: () => void;
  onPatient: () => void;
  onEdocs: () => void;
}) {
  const items = [
    { label: 'New Appointment...', action: onAppointment },
    { label: 'Patient Management...', action: onPatient },
    { label: 'Edit Patient/Admission...', action: onClose },
    { label: 'Copy Appointment', action: onClose },
    { label: 'Edit Appointment/Recurring...', action: onAppointment },
    { label: 'View', action: onClose },
    { label: 'Verify Benefits', action: onClose },
    { label: 'Appointment Confirmation', action: onClose },
    { label: 'Edit Appointment', action: onAppointment },
    { label: 'Check In', action: onClose },
    { label: 'Undo Check In', action: onClose },
    { label: 'View Documentation', action: onEdocs },
    { label: 'Patient Action Center', action: onClose },
    { label: 'Appointment History', action: onClose },
    { label: 'Scan Patient Forms', action: onClose },
  ];

  return (
    <div
      className="context-menu"
      style={{ left: Math.min(position.x, window.innerWidth - 260), top: Math.min(position.y, window.innerHeight - 420) }}
      onClick={(event) => event.stopPropagation()}
    >
      {items.map((item) => (
        <button key={item.label} type="button" onClick={item.action}>
          {item.label}
        </button>
      ))}
    </div>
  );
}

function AppointmentDialog({ appointment, onClose, onEdocs }: { appointment: { name: string; clinician: number; row: number } | null; onClose: () => void; onEdocs: () => void }) {
  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="legacy-dialog" style={{ width: '760px' }} onClick={(event) => event.stopPropagation()}>
        <div className="dialog-titlebar">
          <span>Appointment</span>
          <button type="button" onClick={onClose}>×</button>
        </div>
        <div className="legacy-dialog-body">
          <div className="dialog-row">
            <label>Patient:</label>
            <input value={appointment?.name ?? 'Search patient'} readOnly />
            <button type="button" className="legacy-button" onClick={onEdocs}>Find Patient</button>
            <button type="button" className="text-button">Appt History</button>
          </div>
          <div className="appointment-patient-summary">
            <label>Select <input type="checkbox" defaultChecked /></label>
            <span><b>Start Date</b><br />Sep 16, 2026</span>
            <span><b>Discipline</b><br />PT</span>
            <span><b>Date of Onset</b><br />Jan 1, 2000</span>
            <span><b>Description</b><br />Cervical/Thoracic Spine</span>
          </div>
          <div className="dialog-columns">
            <div className="dialog-panel">
              <h3>APPOINTMENT DETAILS</h3>
              <div className="form-row"><span>Therapist</span><select defaultValue="George Ambrose, PT"><option>George Ambrose, PT</option><option>Kara Bell, PTA</option></select></div>
              <div className="form-row"><span>Type of Visit</span><select defaultValue="PT Visit"><option>PT Visit</option><option>Evaluation</option></select></div>
              <div className="form-row"><span>Start Time</span><select defaultValue="08:00 AM"><option>08:00 AM</option></select></div>
              <div className="form-row"><span>End Time</span><select defaultValue="08:30 AM"><option>08:30 AM</option></select></div>
              <div className="patient-card"><b>Patient Info</b><br />McLean, Bryce<br />DOB: 05/06/1994<br />Phone: (407) 555-0138</div>
            </div>
            <div className="dialog-panel">
              <h3>APPOINTMENT DATES</h3>
              <div className="fake-month">
                <b>September 2026</b>
                <div>{Array.from({ length: 30 }, (_, index) => <span className={index + 1 === 16 ? 'day-selected' : ''} key={index}>{index + 1}</span>)}</div>
              </div>
              <div className="constraint-warning">Appointment cannot be saved without an available date.</div>
            </div>
          </div>
          <div className="dialog-footer">
            <button type="button" className="legacy-button" onClick={onClose}>Cancel recurring patient appointment</button>
            <span className="dialog-spacer" />
            <button type="button" className="legacy-button primary" onClick={onClose}>Save Appointment</button>
            <button type="button" className="legacy-button" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegistrationDialog({ onClose }: { onClose: () => void }) {
  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="legacy-dialog" style={{ width: '610px' }} onClick={(event) => event.stopPropagation()}>
        <div className="dialog-titlebar">
          <span>Patient Registration Center</span>
          <button type="button" onClick={onClose}>×</button>
        </div>
        <div className="legacy-dialog-body">
          <div className="dialog-commandbar">
            <button type="button" className="legacy-button" onClick={onClose}>⌂ Exit</button>
            <button type="button" className="legacy-button">Report</button>
            <button type="button" className="legacy-button">Help</button>
          </div>
          <fieldset>
            <legend>Patient Demographics</legend>
            <div className="registration-grid">
              <div className="form-row"><span>ID</span><input value="C1857832" readOnly /></div>
              <div className="form-row"><span>First</span><input defaultValue="Bryce" /></div>
              <div className="form-row"><span>Middle</span><input /></div>
              <div className="form-row"><span>Last</span><input defaultValue="Mclean" /></div>
              <div className="form-row"><span>Address</span><input defaultValue="2868 Ponkan Summit Dr" /></div>
              <div className="form-row"><span>City</span><input defaultValue="Apopka" /></div>
              <div className="form-row"><span>State</span><input defaultValue="FL" /></div>
              <div className="form-row"><span>Zipcode</span><input defaultValue="32712" /></div>
              <div className="form-row"><span>Telephone</span><input defaultValue="321 370-7599" /></div>
              <div className="form-row"><span>Email Address</span><input defaultValue="bcm18146@gmail.com" /></div>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}

function EdocsDialog({ onClose }: { onClose: () => void }) {
  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="legacy-dialog" style={{ width: '690px' }} onClick={(event) => event.stopPropagation()}>
        <div className="dialog-titlebar">
          <span>E-Docs for Patient #1881942 : Pryor, Cynthia</span>
          <button type="button" onClick={onClose}>×</button>
        </div>
        <div className="legacy-dialog-body">
          <p className="dialog-instruction">Right click to view, email, or print</p>
          <table className="legacy-table">
            <thead><tr><th>Type</th><th>Notes</th><th>Date Added</th><th>By</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Remote Therapeutic Monitoring</td><td>Remote therapeutic monitoring</td><td>09/1/2026</td><td>User, Admin</td><td>Active</td></tr>
              <tr><td>Auth</td><td>cont care auth #231387928</td><td>09/1/2026</td><td>User, Admin</td><td>Active</td></tr>
            </tbody>
          </table>
          <div className="edocs-actions">
            <div><h3>Scan Status</h3><p>AI Scribe Consent <span>N/A</span></p><p>Auth <span>09/04/2026</span></p></div>
            <div><h3>Scan Options</h3><select defaultValue="AI Scribe Consent"><option>AI Scribe Consent</option></select><button type="button" className="legacy-button">Scan</button><textarea defaultValue="" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
