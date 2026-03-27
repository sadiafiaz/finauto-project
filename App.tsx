import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Payroll } from './pages/Payroll';
import { AttendanceDetails } from './pages/AttendanceDetails';
import { Expenses } from './pages/Expenses';
import { Invoices } from './pages/Invoices';
import { Chatbot } from './pages/Chatbot';
import { Tracking } from './pages/Tracking';
import { Settings } from './pages/Settings';
import { ProtectedRoute } from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/payroll" element={<Payroll />} />
                    <Route path="/attendance-details" element={<AttendanceDetails />} />
                    <Route path="/expenses" element={<Expenses />} />
                    <Route path="/invoices" element={<Invoices />} />
                    <Route path="/reports" element={<Dashboard />} />
                    <Route path="/chat" element={<Chatbot />} />
                    <Route path="/tracking" element={<Tracking />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
