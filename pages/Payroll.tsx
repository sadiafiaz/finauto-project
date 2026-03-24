import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_EMPLOYEES } from '../constants';
import { Download, PlayCircle, Clock, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { n8nService } from '../services/n8nService'; // Keep for payroll processing
import { GoogleSheetsEmployee } from '../types';

export const Payroll: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'payroll' | 'attendance'>('payroll');
  const [isProcessing, setIsProcessing] = useState(false);
  const [googleSheetsEmployees, setGoogleSheetsEmployees] = useState<GoogleSheetsEmployee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const handleRunPayroll = async () => {
    setIsProcessing(true);
    try {
      const employeeIds = MOCK_EMPLOYEES.map(emp => emp.id);
      const result = await n8nService.processPayroll(employeeIds);

      if (result.success) {
        // Send WhatsApp notifications to all employees
        for (const employee of MOCK_EMPLOYEES) {
          await n8nService.sendWhatsAppNotification(
            `Hi ${employee.name}, your payroll for this month has been processed. Your payslip is ready for download.`,
            '+1234567890' // Replace with actual employee phone
          );
        }

        alert("Success: Payroll Batch processed! All employees have been notified via WhatsApp and payslips generated.");
      } else {
        alert(`Error processing payroll: ${result.error}`);
      }
    } catch (error) {
      alert('Failed to process payroll. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPayslip = (name: string) => {
    alert(`Downloading PDF Payslip for ${name}...`);
  };

  // Direct Google Sheets API function
  const fetchDirectGoogleSheetsData = async () => {
    // In browser environment, use VITE_ prefix for client-side access
    const spreadsheetId = import.meta.env.VITE_GOOGLE_SHEETS_ID || '1PCMArybtF0LRHdMB2neBZsVbX2zgdOIgxQ4lu4CKUuQ';
    console.log('Using Google Sheets ID:', spreadsheetId);

    if (!spreadsheetId) {
      throw new Error('Google Sheets ID not configured');
    }

    const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=0`;

    try {
      console.log('Fetching directly from Google Sheets CSV:', csvUrl);

      const response = await fetch(csvUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/csv, application/csv, */*'
        },
        // Remove mode: 'cors' to use default handling
      });

      console.log('Response status:', response.status, response.statusText);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Google Sheet access denied. Please ensure the sheet is publicly viewable.');
        } else if (response.status === 404) {
          throw new Error('Google Sheet not found. Please check the sheet ID.');
        }
        throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
      }

      const csvText = await response.text();
      console.log('CSV response length:', csvText.length);
      console.log('Raw CSV data sample:', csvText.substring(0, 200) + '...');

      if (!csvText || csvText.trim().length === 0) {
        throw new Error('Empty response from Google Sheets');
      }

      // Parse CSV data
      const lines = csvText.split('\n').filter(line => line.trim());

      if (lines.length <= 1) {
        throw new Error('No data found in spreadsheet');
      }

      // Skip header row and parse data
      const employees: GoogleSheetsEmployee[] = lines.slice(1).map((line, index) => {
        // Simple CSV parser - handles quoted fields
        const values: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];

          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }

        // Add the last value
        values.push(current.trim());

        // Ensure we have at least 9 columns, pad with empty strings if needed
        while (values.length < 9) {
          values.push('');
        }

        return {
          id: values[0] || `EMP${(index + 1).toString().padStart(3, '0')}`,
          password: values[1] || '',
          fullName: values[2] || `Employee ${index + 1}`,
          pictureUrl: values[3] || '',
          designation: values[4] || 'Unknown',
          cnic: values[5] || '',
          bloodGroup: values[6] || '',
          address: values[7] || '',
          emergencyContact: values[8] || '',
          status: 'Active' as const
        };
      });

      console.log(`Successfully parsed ${employees.length} employees from Google Sheets`);
      return employees;

    } catch (error) {
      console.error('Error fetching from Google Sheets:', error);
      throw error;
    }
  };

  const fetchGoogleSheetsData = async () => {
    setIsLoadingEmployees(true);
    try {
      console.log('Fetching Google Sheets data directly...');
      const employees = await fetchDirectGoogleSheetsData();

      setGoogleSheetsEmployees(employees);
      setTotalRecords(employees.length);
      setCurrentPage(1); // Reset to first page

      console.log(`Loaded ${employees.length} employees successfully`);

    } catch (error) {
      console.error('Error fetching Google Sheets data:', error);
      alert(`Failed to fetch data from Google Sheets: ${error}. Using demo data.`);

      // Generate demo data for fallback
      const demoEmployees = Array.from({ length: 50 }, (_, i) => ({
        id: `EMP${(i + 1).toString().padStart(3, '0')}`,
        password: `temp${i + 1}`,
        fullName: `Employee ${i + 1}`,
        pictureUrl: '',
        designation: ['Software Engineer', 'HR Manager', 'Sales Executive', 'Marketing Specialist', 'Finance Analyst'][i % 5],
        cnic: `12345-${(1234567 + i).toString()}-${(i % 9) + 1}`,
        bloodGroup: ['O+', 'A+', 'B+', 'AB+', 'O-'][i % 5],
        address: `Address ${i + 1}, Street ${i + 1}, City`,
        emergencyContact: `+92-30${i % 10}-${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
        status: 'Active' as const
      }));

      setGoogleSheetsEmployees(demoEmployees);
      setTotalRecords(demoEmployees.length);
      setCurrentPage(1);
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  const openEmployeeDetails = (employeeId: string) => {
    // Find the employee data
    const employee = googleSheetsEmployees.find(emp => emp.id === employeeId);

    if (employee) {
      // Navigate to attendance details page with employee data as URL params
      const params = new URLSearchParams({
        id: employee.id,
        password: employee.password,
        fullName: employee.fullName,
        pictureUrl: employee.pictureUrl,
        designation: employee.designation,
        cnic: employee.cnic,
        bloodGroup: employee.bloodGroup,
        address: employee.address,
        emergencyContact: employee.emergencyContact
      });

      navigate(`/attendance-details?${params.toString()}`);
    } else {
      alert(`Employee data not found for ID: ${employeeId}`);
    }
  };

  // Pagination helpers
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentEmployees = googleSheetsEmployees.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    if (activeTab === 'attendance') {
      fetchGoogleSheetsData();
    }
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payroll & Attendance</h1>
          <p className="text-slate-500">Manage employee salaries and track work hours.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('payroll')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'payroll' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            Payroll
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'attendance' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            Attendance
          </button>
        </div>
      </div>

      {activeTab === 'payroll' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Employee List - Mar 2026</h3>
            <button
              onClick={handleRunPayroll}
              disabled={isProcessing}
              className={`flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm transition-all ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <PlayCircle size={16} /> {isProcessing ? 'Processing...' : 'Run Payroll Batch'}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Basic Salary</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Run</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_EMPLOYEES.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div>{emp.name}</div>
                      <div className="text-xs text-slate-500">{emp.id}</div>
                    </td>
                    <td className="px-6 py-4">{emp.role}</td>
                    <td className="px-6 py-4">{emp.department}</td>
                    <td className="px-6 py-4">${emp.salary.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${emp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{emp.lastPayrollRun}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => downloadPayslip(emp.name)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs font-medium"
                      >
                        <Download size={14} /> Payslip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">


          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900">Attendance</h3>
              {totalRecords > 0 && (
                <p className="text-sm text-slate-600 mt-1">
                  Showing {indexOfFirstRecord + 1}-{Math.min(indexOfLastRecord, totalRecords)} of {totalRecords} employees
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchGoogleSheetsData}
                disabled={isLoadingEmployees}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoadingEmployees ? 'Loading...' : 'Refresh Data'}
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {isLoadingEmployees ? (
              <div className="text-center py-8 text-slate-500">Loading employee data...</div>
            ) : currentEmployees.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No employee data available</div>
            ) : (
              currentEmployees.map((emp) => (
                <div key={emp.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    {emp.pictureUrl ? (
                      <img
                        src={emp.pictureUrl}
                        alt={emp.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold ${emp.pictureUrl ? 'hidden' : ''}`}>
                      {emp.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{emp.fullName}</div>
                      <div className="text-xs text-slate-500">{emp.id} • {emp.designation}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 text-sm">
                    <div className="flex flex-col items-center max-w-32">
                      <span className="text-xs text-slate-400 uppercase">Address</span>
                      <span className="font-medium text-slate-700 text-center text-xs">{emp.address}</span>
                    </div>
                    <div className="flex flex-col items-center max-w-32">
                      <span className="text-xs text-slate-400 uppercase">Emergency Contact</span>
                      <span className="font-medium text-slate-700 text-center text-xs">{emp.emergencyContact}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {emp.status === 'Active' ? <CheckCircle size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-500" />}
                      <span className="font-medium">{emp.status}</span>
                    </div>
                    <button
                      onClick={() => openEmployeeDetails(emp.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs transition-colors"
                    >
                      <ExternalLink size={14} />
                      Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {totalRecords > recordsPerPage && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
              <div className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`px-3 py-1 text-sm rounded-lg ${currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-300 hover:bg-slate-50'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
