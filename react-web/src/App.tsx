import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ScanningModule } from './modules/ScanningModule';
import { PatientSearchModule } from './modules/PatientSearchModule';
import { ComponentLibrary } from './pages/ComponentLibrary';

function MainApp() {
  const queryParams = new URLSearchParams(window.location.search);
  const activeModule = queryParams.get('module') || 'scanning';
  const { theme, setTheme } = useTheme();
  const [isClosed, setIsClosed] = useState(false);

  const handleClose = async () => {
    try {
      await fetch('http://localhost:8080/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'MODULE_CLOSED', module: activeModule })
      });
    } catch (err) {
      console.error(err);
    }
    setIsClosed(true);
    window.close();
  };

  if (isClosed) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 text-center font-sans">
          <h2 className="text-lg font-semibold text-slate-800">Module Closed</h2>
          <p className="text-sm text-slate-500 mt-1">You can safely return to the desktop application.</p>
        </div>
      </div>
    );
  }

  const renderActiveScreen = () => {
    switch (activeModule) {
      case 'patient-search':
        return <PatientSearchModule onClose={handleClose} />;
      case 'library':
        return <ComponentLibrary />;
      case 'scanning':
      default:
        return <ScanningModule onClose={handleClose} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${theme === 'windows' ? 'bg-[#3A6EA5]' : 'bg-slate-100'}`}>
      
      {/* Top Fixed Control Bar: Screen Navigation + Theme Switcher */}
      <div className="fixed top-4 right-4 bg-white p-2 rounded-lg shadow-xl border border-slate-300 flex items-center gap-3 z-[2000] text-xs font-sans text-slate-700">
        
        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          <span className="font-semibold text-slate-500 mr-1">Screens:</span>
          
          <a
            href="?module=scanning"
            className={`px-2.5 py-1 rounded font-medium no-underline transition-colors ${
              activeModule === 'scanning'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Scanning
          </a>

          <a
            href="?module=patient-search"
            className={`px-2.5 py-1 rounded font-medium no-underline transition-colors ${
              activeModule === 'patient-search'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Patient Search
          </a>

          <a
            href="?module=library"
            className={`px-2.5 py-1 rounded font-medium no-underline transition-colors ${
              activeModule === 'library'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Component Library
          </a>
        </div>

        <span className="text-slate-300">|</span>

        {/* Theme Switcher Buttons */}
        <div className="flex items-center gap-1">
          <span className="font-semibold text-slate-500 mr-1">Theme:</span>
          <button
            onClick={() => setTheme('windows')}
            className={`px-2.5 py-1 rounded transition-colors ${
              theme === 'windows' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Windows Classic
          </button>
          <button
            onClick={() => setTheme('modern')}
            className={`px-2.5 py-1 rounded transition-colors ${
              theme === 'modern' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Modern Tailwind
          </button>
        </div>

      </div>

      {/* Render Active Screen / Module */}
      {renderActiveScreen()}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}