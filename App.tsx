import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Payroll } from './pages/Payroll';
import { Expenses } from './pages/Expenses';
import { Invoices } from './pages/Invoices';
import { Chatbot } from './pages/Chatbot';
import { Tracking } from './pages/Tracking';
import { Settings } from './pages/Settings';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/reports" element={<Dashboard />} /> {/* Reusing Dashboard for Reports demo */}
          <Route path="/chat" element={<Chatbot />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;