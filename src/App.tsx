import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SettingsPage from './SettingsPage';
import HomePage from './HomePage';
import FormResponse from './FormResponses.tsx';

const App: React.FC = () => {
  const [showSettings] = useState(!localStorage.getItem('userName'));

  if (showSettings) {
    return <SettingsPage onComplete={() => window.location.reload()} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/form/:formId" element={<FormResponse />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;