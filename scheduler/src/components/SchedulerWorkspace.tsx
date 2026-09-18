import { useState, type MouseEvent } from 'react';
import type { ScanContextType } from '../types';
import { ScanWorkstation } from './ScanWorkstation';
import {
  CalendarIcon,
  CheckCircleIcon,
  ClipboardListIcon,
  HelpCircleIcon,
  MailIcon,
  PlusIcon,
  PrinterIcon,
  ScanIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
  XIcon,
} from './Icons';

type AppointmentColor = 'green' | 'blue' | 'pink' | 'yellow' | 'red' | 'purple';

interface Appointment {
  id: string;
  patient: string;
  provider: number;
  row: number;
  color: AppointmentColor;
  icons: string;
}

const providers = [
  'IBST Miscellaneous, PT',
  'IBST Miscellaneous, PT',
  'IBST Miscellaneous, PT',
  'IBST Miscellaneous, PT',
  'George Ambrose, PT',
  'George Ambrose, PT',
  'Kara Bell, PTA',
  'Kara Bell, PTA',
  'Kara Bell, PTA',
  'Justin Herman, PT',
  'Mary Scott, PT',
  'Randy Jones, PTA',
];

const times = ['7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'];

const appointments: Appointment[] = [
  { id: 'a1', patient: 'Smith Katelyn', provider: 0, row: 0, color: 'pink', icons: '✓ ◉' },
  { id: 'a2', patient: 'Swain Lisa', provider: 0, row: 2, color: 'green', icons: '✓ ◉' },
  { id: 'a3', patient: 'Lara Gerardo', provider: 0, row: 4, color: 'green', icons: '◉' },
  { id: 'a4', patient: 'Schlachter Laura', provider: 0, row: 6, color: 'green', icons: '✓ ◉' },
  { id: 'a5', patient: 'Secules Mary', provider: 0, row: 8, color: 'blue', icons: '✓ ◉' },
  { id: 'a6', patient: 'Amera Kelly', provider: 0, row: 10, color: 'blue', icons: '◉' },
  { id: 'a7', patient: 'Key Yocca', provider: 0, row: 12, color: 'blue', icons: '✓ ◉' },
  { id: 'a8', patient: 'Arces Nicolas', provider: 0, row: 16, color: 'green', icons: '✓ ◉' },
  { id: 'a9', patient: 'Young Elizabeth', provider: 1, row: 2, color: 'green', icons: '✓' },
  { id: 'a10', patient: 'Torres Santana', provider: 1, row: 4, color: 'green', icons: '✓ ◉' },
  { id: 'a11', patient: 'Woodard Nicole', provider: 1, row: 10, color: 'green', icons: '✓ ◉' },
  { id: 'a12', patient: 'Smith Maurice', provider: 1, row: 12, color: 'green', icons: '✓ ◉' },
  { id: 'a13', patient: 'Imana Nia', provider: 1, row: 14, color: 'pink', icons: '◉' },
  { id: 'a14', patient: 'Padier Crystal', provider: 1, row: 16, color: 'green', icons: '✓ ◉' },
  { id: 'a15', patient: 'Mclean Bryce', provider: 2, row: 2, color: 'green', icons: '✓ ◉' },
  { id: 'a16', patient: 'Mclean Mark', provider: 2, row: 6, color: 'green', icons: '✓ ◉' },
  { id: 'a17', patient: 'Bono Robert', provider: 2, row: 10, color: 'green', icons: '✓ ◉' },
  { id: 'a18', patient: 'Walker Linda', provider: 2, row: 16, color: 'green', icons: '✓ ◉' },
  { id: 'a19', patient: 'Mullins Helen', provider: 3, row: 6, color: 'green', icons: '✓ ◉' },
  { id: 'a20', patient: 'Somtoomay Chris', provider: 3, row: 14, color: 'pink', icons: '✓ ◉' },
  { id: 'a21', patient: 'Rosa Lorenzo', provider: 3, row: 18, color: 'green', icons: '✓ ◉' },
  { id: 'a22', patient: 'Dinmore Margie', provider: 4, row: 6, color: 'green', icons: '✓ ◉' },
  { id: 'a23', patient: 'Sander Power', provider: 4, row: 12, color: 'yellow', icons: '⚠ ◉' },
  { id: 'a24', patient: 'Reaves William', provider: 4, row: 2, color: 'green', icons: '✓ ◉' },
  { id: 'a25', patient: 'Hernon David', provider: 4, row: 12, color: 'green', icons: '✓ ◉' },
  { id: 'a26', patient: 'Cruz Jazmy', provider: 5, row: 14, color: 'green', icons: '✓ ◉' },
  { id: 'a27', patient: 'Noriega Melba', provider: 5, row: 14, color: 'green', icons: '✓ ◉' },
  { id: 'a28', patient: 'Rangel Keith', provider: 5, row: 2, color: 'purple', icons: '✓ ◉' },
  { id: 'a29', patient: 'Alexandre Gladys', provider: 5, row: 6, color: 'purple', icons: '✓ ◉' },
  { id: 'a30', patient: 'Gutierrez Ozara', provider: 6, row: 4, color: 'pink', icons: '✓ ◉' },
  { id: 'a31', patient: 'Santiago Carlos', provider: 6, row: 0, color: 'green', icons: '✓ ◉' },
  { id: 'a32', patient: 'Vasquez Garcia', provider: 6, row: 6, color: 'pink', icons: '✓ ◉' },
  { id: 'a33', patient: 'Morris Marvin', provider: 6, row: 8, color: 'green', icons: '✓ ◉' },
  { id: 'a34', patient: 'Jordan Faye', provider: 7, row: 0, color: 'pink', icons: '✓ ◉' },
  { id: 'a35', patient: 'Wheeler Jerry', provider: 7, row: 0, color: 'purple', icons: '✓ ◉' },
  { id: 'a36', patient: 'Gutierrez Ozara', provider: 7, row: 4, color: 'blue', icons: '✓ ◉' },
  { id: 'a37', patient: 'Molina Sonia', provider: 7, row: 12, color: 'green', icons: '✓ ◉' },
  { id: 'a38', patient: 'Garcia Nasha', provider: 8, row: 8, color: 'yellow', icons: '⚠ ◉' },
  { id: 'a39', patient: 'Fisher Shirley', provider: 8, row: 14, color: 'green', icons: '✓ ◉' },
  { id: 'a40', patient: 'Frizzies Gerardo', provider: 8, row: 16, color: 'green', icons: '✓ ◉' },
  { id: 'a41', patient: 'Lock Kenneth', provider: 9, row: 0, color: 'green', icons: '◉' },
  { id: 'a42', patient: 'Josec Wellington', provider: 10, row: 0, color: 'green', icons: '✓ ◉' },
  { id: 'a43', patient: 'Robinson Rose', provider: 10, row: 6, color: 'green', icons: '✓ ◉' },
  { id: 'a44', patient: 'Solemon Lovisa', provider: 10, row: 10, color: 'green', icons: '✓ ◉' },
  { id: 'a45', patient: 'Bryant Brian', provider: 11, row: 10, color: 'green', icons: '✓ ◉' },
];

const checkedIn = ['Young Elizabeth', 'Mclean Bryce', 'Morris Marvin', 'Santiago Carlos', 'Gutierrez Ozara', 'Rangel Keith', 'Torres Santana', 'Wheeler Jerry', 'Walker Linda', 'Padier Crystal', 'Fisher Shirley', 'Noriega Melba'];

export function SchedulerWorkspace() {
  const [dialog, setDialog] = useState<'appointment' | 'registration' | 'edocs' | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedDay, setSelectedDay] = useState(16);
  const [search, setSearch] = useState('');
  const [scanMode, setScanMode] = useState(false);
  const [contextType, setContextType] = useState<ScanContextType>('PATIENT');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [scanMenuOpen, setScanMenuOpen] = useState(false);

  const openAppointment = (appointment?: Appointment) => {
    setSelectedAppointment(appointment ?? null);
    setDialog('appointment');
  };

  return (
    <div className="scheduler-app">
      <div className="legacy-titlebar">
        <span>CORA - Scheduling for -- Apopka - CORA</span>
        <div className="legacy-window-buttons"><span>_</span><span>□</span><span>×</span></div>
      </div>
      <div className="legacy-menubar">
        {['File', 'Edit', 'View', 'Reports', 'Scan', 'Help', 'Appointment Tools'].map((item) => <span key={item}>{item}</span>)}
      </div>
      <div className="legacy-toolbar">
        <ToolButton icon={<UserIcon />} label="Patient" onClick={() => setDialog('registration')} />
        <ToolButton icon={<PlusIcon />} label="New Appt" onClick={() => openAppointment()} />
        <ToolButton icon={<CalendarIcon />} label="Calendar" />
        <ToolButton icon={<ClipboardListIcon />} label="Report" />
        <ToolButton icon={<ScanIcon />} label="Scan" onClick={() => setScanMode(true)} />
        <ToolButton icon={<PrinterIcon />} label="Print" />
        <ToolButton icon={<MailIcon />} label="E-Mail" />
        <ToolButton icon={<SettingsIcon />} label="Settings" />
        <div className="toolbar-separator" />
        <div className="legacy-kpi"><b>Actual Weekly Appts:</b> 473.20</div>
        <div className="legacy-kpi"><b>Actual Weekly Visits:</b> 437</div>
        <div className="legacy-kpi"><b>Outstanding Appts:</b> 210</div>
        <div className="legacy-kpi"><b>Daily Appts:</b> 78</div>
      </div>

      <div className="scheduler-content" onClick={() => { setContextMenu(null); setScanMenuOpen(false); }}>
        {scanMode ? <section className="scan-module-content"><div className="scan-module-header"><button className="legacy-button" onClick={(event) => { event.stopPropagation(); setScanMode(false); }}>← Back to Scheduling</button><b>Scanning Workstation</b><span>Patient context: PT-2024-0042</span></div><ScanWorkstation contextType={contextType} onContextChange={setContextType} /></section> : <>
        <aside className="schedule-sidebar">
          <div className="side-heading">Targeted Weekly Appts: 473.20</div>
          <div className="month-switch"><button>‹</button><b>September 2026</b><button>›</button></div>
          <div className="mini-calendar">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <b key={day}>{day}</b>)}
            {[30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3].map((day, index) => <button key={`${day}-${index}`} className={day === selectedDay ? 'selected' : ''} onClick={() => setSelectedDay(day)}>{day}</button>)}
          </div>
          <div className="side-actions"><button>Previous</button><button>Today</button><button>Next</button></div>
          <div className="provider-list">
            {providers.slice(0, 9).map((provider, index) => <label key={`${provider}-${index}`}><input type="checkbox" defaultChecked={index < 6} /> {provider}</label>)}
          </div>
          <div className="side-links"><button>Select All</button><button>Clear All</button></div>
          <div className="patient-info-title">Patient/Appt. Info</div>
          <div className="patient-checks">
            {['Appt. Tested & Not Confirmed', 'Checked In', 'Orders', 'Needs Verification'].map((item) => <label key={item}><input type="checkbox" /> {item}</label>)}
          </div>
          <div className="patient-detail"><b>McLean, Bryce</b><br />DOB: 05/06/1994<br />Phone: (407) 555-0138<br />Patient ID: C1857832<br /><br /><b>Appt:</b> 08/30/26<br /><b>Appt time:</b> 08:00 AM - 08:30 AM</div>
        </aside>

        <section className="schedule-main">
          <div className="schedule-summary"><b>Weekly Visits: 166</b><span>Wk TH-Evals(goal): 5 (3.30)</span><span>Daily Appts: 78</span><span>Weekly Evals: 22</span><button>Show/Refresh Hrs</button></div>
          <div className="schedule-scroll">
            <div className="schedule-grid">
              <div className="time-column"><div className="grid-corner">2026<br /><small>Wed 16</small></div>{times.map((time) => <div className="time-cell" key={time}>{time}</div>)}</div>
              <div className="provider-columns">
                {providers.map((provider, providerIndex) => <div className="provider-column" key={`${provider}-${providerIndex}`}>
                  <div className={`provider-header provider-${providerIndex % 4}`}>{provider}</div>
                  {times.map((time, row) => {
                    const appointment = appointments.find((item) => item.provider === providerIndex && item.row === row);
                    return <div className="appointment-cell" key={`${time}-${row}`} onDoubleClick={() => openAppointment()} onContextMenu={(event: MouseEvent<HTMLDivElement>) => { event.preventDefault(); event.stopPropagation(); setContextMenu({ x: event.clientX, y: event.clientY }); }}>{appointment && <button className={`appointment appointment-${appointment.color}`} onClick={() => openAppointment(appointment)}><b>{appointment.patient}</b><span>{appointment.icons}</span></button>}{row === 10 && providerIndex === 4 && <span className="closed-label">Lunch</span>}{row === 20 && <span className="closed-label">Closed</span>}</div>;
                  })}
                </div>)}
              </div>
            </div>
          </div>
        </section>

        <aside className="checked-sidebar">
          <div className="checked-title">Checked In / Pay Later</div>
          <div className="checked-search"><SearchIcon size={13} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find patient" /></div>
          <div className="checked-list">
            {checkedIn.filter((name) => name.toLowerCase().includes(search.toLowerCase())).map((name, index) => <button key={name} onClick={() => openAppointment(appointments.find((item) => item.patient === name))}><span className="checked-time">{index % 2 === 0 ? '08:00 AM' : '09:00 AM'}</span><span>{name}</span><CheckCircleIcon size={13} /></button>)}
          </div>
          <div className="legend"><span><i className="legend-green" /> Scheduled</span><span><i className="legend-teal" /> Checked In</span><span><i className="legend-blue" /> Complete</span><span><i className="legend-red" /> Overdue</span></div>
        </aside>
        </>}
      </div>

      <div className="legacy-statusbar"><span>Apopka - CORA</span><span>Ready</span><span className="status-spacer" /><span>Sep 16 2026 9:40 AM</span></div>

      {dialog === 'appointment' && <AppointmentDialog appointment={selectedAppointment} onClose={() => setDialog(null)} onEdocs={() => setDialog('edocs')} />}
      {dialog === 'registration' && <RegistrationDialog onClose={() => setDialog(null)} />}
      {dialog === 'edocs' && <EdocsDialog onClose={() => setDialog(null)} />}
      {contextMenu && <ContextMenu position={contextMenu} scanMenuOpen={scanMenuOpen} onClose={() => setContextMenu(null)} onAppointment={() => { setContextMenu(null); openAppointment(); }} onPatient={() => { setContextMenu(null); setDialog('registration'); }} onEdocs={() => { setContextMenu(null); setDialog('edocs'); }} onScanMenu={() => setScanMenuOpen((open) => !open)} />}
    </div>
  );
}

function ContextMenu({ position, scanMenuOpen, onClose, onAppointment, onPatient, onEdocs, onScanMenu }: { position: { x: number; y: number }; scanMenuOpen: boolean; onClose: () => void; onAppointment: () => void; onPatient: () => void; onEdocs: () => void; onScanMenu: () => void }) {
  const items = ['New Appointment...', 'Patient Management...', 'Edit Patient/Admission...', 'Copy Appointment', 'Edit Appointment/Recurring...', 'View', 'Verify Benefits', 'Appointment Confirmation', 'Edit Appointment', 'Check In', 'Undo Check In', 'Undo Check Out', 'Give Appointment To...', 'Cancel Appt.', 'Appointment Wizard...', 'Appointment History', 'View Documentation', 'Patient Action Center', 'Notes', 'Import Patient Form...', 'Patient Encounter...'];
  return <div className="context-menu" style={{ left: Math.min(position.x, window.innerWidth - 260), top: Math.min(position.y, window.innerHeight - 520) }} onClick={(event) => event.stopPropagation()}>
    {items.map((item) => item === 'New Appointment...' ? <button key={item} onClick={onAppointment}>{item}</button> : item === 'Patient Management...' ? <button key={item} onClick={onPatient}>{item}</button> : item === 'View Documentation' ? <button key={item} onClick={onEdocs}>{item}<span>›</span></button> : item === 'Scan Patient Forms' ? null : <button key={item}>{item}{['Edit Appointment/Recurring...', 'View', 'Appointment History', 'Patient Action Center'].includes(item) && <span>›</span>}</button>)}
    <button className="context-scan" onClick={onScanMenu}>Scan Patient Forms <span>›</span></button>
    {scanMenuOpen && <div className="context-submenu">{['Scan State Issued ID', 'Scan Insurance Card', 'Scan Auth', 'Scan EOB', 'Scan Patient Forms', 'Scan Letter Of Protection', 'Scan Other Therapy Note', 'Scan Visit Patient Information', 'Scan Medicare Payment Agreement', 'Scan Signed POC Forms', 'Scan Signed Therapy Progress Notes', 'Open E-Docs'].map((item) => <button key={item} onClick={item === 'Open E-Docs' ? onEdocs : onClose}>{item}</button>)}</div>}
  </div>;
}

function ToolButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return <button className="toolbar-button" onClick={onClick}><span>{icon}</span><small>{label}</small></button>;
}

function AppointmentDialog({ appointment, onClose, onEdocs }: { appointment: Appointment | null; onClose: () => void; onEdocs: () => void }) {
  return <LegacyDialog title="Appointment" onClose={onClose} width="760px">
    <div className="dialog-row patient-row"><label>Patient:</label><input value={appointment?.patient ?? 'Search patient'} readOnly /><button className="legacy-button" onClick={onEdocs}><SearchIcon size={13} /> Find Patient</button><button className="text-button">Appt History</button></div>
    <div className="appointment-patient-summary"><label>Select <input type="checkbox" defaultChecked /></label><span><b>Start Date</b><br />Sep 16, 2026</span><span><b>Discipline</b><br />PT</span><span><b>Date of Onset</b><br />Jan 1, 2000</span><span><b>Description</b><br />Cervical/Thoracic Spine</span></div>
    <div className="dialog-columns"><div className="dialog-panel"><h3>APPOINTMENT DETAILS</h3><FormRow label="Therapist"><select><option>George Ambrose, PT</option><option>Kara Bell, PTA</option></select></FormRow><FormRow label="Type of Visit"><select><option>PT Visit</option><option>Evaluation</option></select></FormRow><FormRow label="Start Time"><select><option>08:00 AM</option></select></FormRow><FormRow label="End Time"><select><option>08:30 AM</option></select></FormRow><div className="patient-card"><b>Patient Info</b><br />McLean, Bryce<br />DOB: 05/06/1994<br />Phone: (407) 555-0138</div></div><div className="dialog-panel"><h3>APPOINTMENT DATES</h3><div className="fake-month"><b>September 2026</b><div>{Array.from({ length: 30 }, (_, index) => <span className={index + 1 === 16 ? 'day-selected' : ''} key={index}>{index + 1}</span>)}</div></div><div className="constraint-warning">Appointment cannot be saved without an available date.</div></div></div>
    <div className="dialog-footer"><button className="legacy-button" onClick={onClose}>Cancel recurring patient appointment</button><span className="dialog-spacer" /><button className="legacy-button primary" onClick={onClose}>Save Appointment</button><button className="legacy-button" onClick={onClose}>Cancel</button></div>
  </LegacyDialog>;
}

function RegistrationDialog({ onClose }: { onClose: () => void }) {
  return <LegacyDialog title="Patient Registration Center" onClose={onClose} width="610px"><div className="dialog-commandbar"><button className="legacy-button" onClick={onClose}>⌂ Exit</button><button className="legacy-button"><PrinterIcon size={13} /> Report</button><button className="legacy-button"><HelpCircleIcon size={13} /> Help</button></div><fieldset><legend>Patient Demographics</legend><div className="registration-grid"><FormRow label="ID"><input value="C1857832" readOnly /></FormRow><FormRow label="First"><input defaultValue="Bryce" /></FormRow><FormRow label="Middle"><input /></FormRow><FormRow label="Last"><input defaultValue="Mclean" /></FormRow><FormRow label="Address"><input defaultValue="2868 Ponkan Summit Dr" /></FormRow><FormRow label="City"><input defaultValue="Apopka" /></FormRow><FormRow label="State"><input defaultValue="FL" /></FormRow><FormRow label="Zipcode"><input defaultValue="32712" /></FormRow><FormRow label="Telephone"><input defaultValue="321 370-7599" /></FormRow><FormRow label="Email Address"><input defaultValue="bcm18146@gmail.com" /></FormRow></div><div className="registration-checks"><label><input type="checkbox" /> Patient opted out</label><label><input type="checkbox" defaultChecked /> Text Patient</label><label><input type="checkbox" /> Not collected</label></div></fieldset><div className="registration-tabs"><button>View Admissions</button><button>Medicare Cap</button><button>Hospitalizations</button><button>Referral History</button></div><div className="registration-lower"><div><FormRow label="Marital Status"><select><option /></select></FormRow><FormRow label="Student?"><select><option /></select></FormRow><FormRow label="Employed?"><select><option /></select></FormRow><label><input type="checkbox" /> PHI Consent - Atty</label><label><input type="checkbox" /> Bankruptcy</label></div><div><FormRow label="Birthday"><input defaultValue="5/8/2004" /></FormRow><FormRow label="Social Security"><input /></FormRow><b>Age: 22</b></div><div><b>Sex</b><label><input type="radio" name="sex" defaultChecked /> Male</label><label><input type="radio" name="sex" /> Female</label><label><input type="radio" name="sex" /> Ambiguous</label></div><div className="notes-box"><b>Notes</b><textarea defaultValue="6/19/26 LOR Approved..." /></div></div></LegacyDialog>;
}

function EdocsDialog({ onClose }: { onClose: () => void }) {
  return <LegacyDialog title="E-Docs for Patient #1881942 : Pryor, Cynthia" onClose={onClose} width="690px"><p className="dialog-instruction">Right click to view, email, or print</p><table className="legacy-table"><thead><tr><th>Type</th><th>Notes</th><th>Date Added</th><th>By</th><th>Status</th></tr></thead><tbody>{['Remote Therapeutic Monitoring', 'Auth', 'Signed Plan Of Care', 'State Issued ID - Back', 'Insurance Card', 'Medicare Card'].map((item, index) => <tr key={item}><td>{item}</td><td>{index === 0 ? 'Remote therapeutic monitoring' : 'cont care auth #231387928'}</td><td>09/1/2026</td><td>User, Admin</td><td>Active</td></tr>)}</tbody></table><div className="edocs-actions"><div><h3>Scan Status</h3>{['AI Scribe Consent', 'AI Scribe Decline', 'Assignment of Benefits', 'Auth', 'Benefits Info', 'POC', 'Insurance Card', 'Letter of Protection'].map((item, index) => <p className={index % 3 === 1 ? 'red-text' : ''} key={item}>{item} <span>{index < 2 ? 'N/A' : '09/04/2026'}</span></p>)}</div><div><h3>Scan Options</h3><select><option>AI Scribe Consent</option></select><button className="legacy-button">Scan</button><textarea /></div></div></LegacyDialog>;
}

function LegacyDialog({ title, onClose, children, width }: { title: string; onClose: () => void; children: React.ReactNode; width: string }) {
  return <div className="dialog-backdrop"><div className="legacy-dialog" style={{ width }}><div className="dialog-titlebar"><span>{title}</span><button onClick={onClose}><XIcon size={14} /></button></div><div className="legacy-dialog-body">{children}</div></div></div>;
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="form-row"><span>{label}</span>{children}</label>;
}
