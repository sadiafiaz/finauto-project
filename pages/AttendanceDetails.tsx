import React, { useState } from 'react';
import { Calendar, CheckCircle, XCircle, AlertCircle, Mail, Phone, Building2, Banknote, CreditCard, CalendarDays } from 'lucide-react';
import { n8nService } from '../services/n8nService';
import { AttendanceDetails as AttendanceDetailsType } from '../types';

export const AttendanceDetails: React.FC = () => {
    const [empId, setEmpId] = useState('');
    const [empPassword, setEmpPassword] = useState('');
    const [attendanceData, setAttendanceData] = useState<AttendanceDetailsType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAttendanceData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            console.log(`Fetching attendance for employee: ${empId}`);
            const result = await n8nService.fetchEmployeeAttendance(empId, empPassword);

            if (result.success && result.data) {
                setAttendanceData(result.data);
            } else {
                throw new Error(result.error || 'Failed to fetch attendance data');
            }
        } catch (err) {
            console.error('Error fetching attendance:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch attendance data');

            // Mock data for demo purposes
            setAttendanceData({
                success: true,
                employee: {
                    employee_id: empId,
                    name: '',
                    email: '',
                    phone: '',
                    basic_salary: 0,
                    allowance: 0,
                    bank_account: '',
                    ifsc_code: '',
                    department: '',
                    joining_date: '',
                    created_at: ''
                },
                attendance: {
                    summary: { P: 21, A: 3, L: 2 },
                    calendar: []
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (empId && empPassword) {
            setAttendanceData(null);
            setError(null);
            fetchAttendanceData();
        }
    };

    const hasEmployeeData = !!attendanceData?.employee?.employee_id;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'P':
                return <CheckCircle size={16} className="text-green-500" />;
            case 'A':
                return <XCircle size={16} className="text-red-500" />;
            case 'L':
                return <AlertCircle size={16} className="text-yellow-500" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'P':
                return 'bg-green-100 text-green-800';
            case 'A':
                return 'bg-red-100 text-red-800';
            case 'L':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'P':
                return 'Present';
            case 'A':
                return 'Absent';
            case 'L':
                return 'Late';
            default:
                return 'Unknown';
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Heading */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
                <p className="text-sm text-slate-500 mt-1">Look up attendance records by employee ID</p>
            </div>

            {/* Search Form */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Employee Attendance Lookup</h2>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="Employee ID"
                        value={empId}
                        onChange={(e) => setEmpId(e.target.value)}
                        required
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={empPassword}
                        onChange={(e) => setEmpPassword(e.target.value)}
                        required
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Loading...' : 'Search'}
                    </button>
                </form>
            </div>

            {/* Employee Information Card */}
            {attendanceData && hasEmployeeData && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    {attendanceData ? (
                        <div className="flex items-start gap-6">
                            <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-2xl flex-shrink-0">
                                {attendanceData.employee.name.charAt(0) || empId.charAt(0)}
                            </div>

                            <div className="flex-grow">
                                <h1 className="text-2xl font-bold text-slate-900 mb-1">{attendanceData.employee.name || empId}</h1>
                                <p className="text-slate-600 mb-4">{attendanceData.employee.department} • {attendanceData.employee.employee_id}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="text-slate-400" size={16} />
                                        <span className="text-slate-600">{attendanceData.employee.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="text-slate-400" size={16} />
                                        <span className="text-slate-600">{attendanceData.employee.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Building2 className="text-slate-400" size={16} />
                                        <span className="text-slate-600">{attendanceData.employee.department}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <CalendarDays className="text-slate-400" size={16} />
                                        <span className="text-slate-600">Joined: {attendanceData.employee.joining_date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Banknote className="text-slate-400" size={16} />
                                        <span className="text-slate-600">Salary: PKR {attendanceData.employee.basic_salary.toLocaleString()} + {attendanceData.employee.allowance.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <CreditCard className="text-slate-400" size={16} />
                                        <span className="text-slate-600 truncate">{attendanceData.employee.bank_account}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-slate-600">Loading attendance data...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="text-center">
                        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Loading Attendance</h3>
                        <p className="text-slate-600 mb-4">{error}</p>
                        <button
                            onClick={fetchAttendanceData}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}

            {/* No Data Found */}
            {attendanceData && !isLoading && !hasEmployeeData && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-10">
                    <div className="text-center">
                        <XCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-700 mb-1">No Data Found</h3>
                        <p className="text-sm text-slate-500">No attendance records were found for the provided credentials.</p>
                    </div>
                </div>
            )}

            {/* Attendance Data */}
            {attendanceData && !isLoading && hasEmployeeData && (
                <>
                    {/* Summary Statistics */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Calendar size={24} />
                            {attendanceData.attendance.calendar.length > 0
                                ? new Date(attendanceData.attendance.calendar[0].date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                                : 'Attendance'} - Summary
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <CheckCircle size={24} className="text-green-600" />
                                    <div>
                                        <div className="text-green-600 font-semibold">Present</div>
                                        <div className="text-2xl font-bold text-green-900">{attendanceData.attendance.summary.P}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-red-50 p-4 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <XCircle size={24} className="text-red-600" />
                                    <div>
                                        <div className="text-red-600 font-semibold">Absent</div>
                                        <div className="text-2xl font-bold text-red-900">{attendanceData.attendance.summary.A}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <AlertCircle size={24} className="text-yellow-600" />
                                    <div>
                                        <div className="text-yellow-600 font-semibold">Late</div>
                                        <div className="text-2xl font-bold text-yellow-900">{attendanceData.attendance.summary.L}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </>
            )}
        </div>
    );
};
