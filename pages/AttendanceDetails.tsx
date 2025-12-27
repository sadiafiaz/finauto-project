import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, CheckCircle, XCircle, AlertCircle, User, Phone, MapPin, Droplets } from 'lucide-react';
import { n8nService } from '../services/n8nService';
import { AttendanceDetails as AttendanceDetailsType, GoogleSheetsEmployee } from '../types';

export const AttendanceDetails: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [attendanceData, setAttendanceData] = useState<AttendanceDetailsType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Employee data from URL params
    const employeeData: GoogleSheetsEmployee = {
        id: searchParams.get('id') || '',
        password: searchParams.get('password') || '',
        fullName: searchParams.get('fullName') || '',
        pictureUrl: searchParams.get('pictureUrl') || '',
        designation: searchParams.get('designation') || '',
        cnic: searchParams.get('cnic') || '',
        bloodGroup: searchParams.get('bloodGroup') || '',
        address: searchParams.get('address') || '',
        emergencyContact: searchParams.get('emergencyContact') || '',
        status: 'Active'
    };

    const fetchAttendanceData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            console.log(`Fetching attendance for employee: ${employeeData.id}`);
            const result = await n8nService.fetchEmployeeAttendance(employeeData.id, employeeData.password);

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
                attendance: {
                    summary: {
                        P: 21,
                        A: 3,
                        L: 2
                    },
                    calendar: generateMockCalendar()
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    const generateMockCalendar = () => {
        const calendar = [];
        const startDate = new Date('2025-11-01');
        const statuses = ['P', 'P', 'P', 'P', 'A', 'P', 'P', 'A', 'L', 'P', 'P', 'P', 'P', 'A', 'P', 'L', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'];

        for (let i = 0; i < 26; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            calendar.push({
                date: date.toISOString().split('T')[0],
                status: statuses[i] as 'P' | 'A' | 'L'
            });
        }

        return calendar;
    };

    useEffect(() => {
        if (employeeData.id && employeeData.password) {
            fetchAttendanceData();
        } else {
            setError('Invalid employee data');
        }
    }, [employeeData.id, employeeData.password]);

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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            weekday: date.toLocaleDateString('en-US', { weekday: 'short' })
        };
    };

    if (!employeeData.id) {
        return (
            <div className="p-6 text-center">
                <div className="text-red-600">Invalid employee data</div>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with back button */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Attendance
                </button>
            </div>

            {/* Employee Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                        {employeeData.pictureUrl ? (
                            <img
                                src={employeeData.pictureUrl}
                                alt={employeeData.fullName}
                                className="w-20 h-20 rounded-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                        ) : null}
                        <div className={`w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-2xl ${employeeData.pictureUrl ? 'hidden' : ''}`}>
                            {employeeData.fullName.charAt(0)}
                        </div>
                    </div>

                    <div className="flex-grow">
                        <h1 className="text-2xl font-bold text-slate-900 mb-1">{employeeData.fullName}</h1>
                        <p className="text-slate-600 mb-4">{employeeData.designation} • {employeeData.id}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                <User className="text-slate-400" size={16} />
                                <span className="text-slate-600">{employeeData.cnic}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Droplets className="text-slate-400" size={16} />
                                <span className="text-slate-600">{employeeData.bloodGroup}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="text-slate-400" size={16} />
                                <span className="text-slate-600">{employeeData.address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="text-slate-400" size={16} />
                                <span className="text-slate-600">{employeeData.emergencyContact}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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

            {/* Attendance Data */}
            {attendanceData && !isLoading && (
                <>
                    {/* Summary Statistics */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Calendar size={24} />
                            November 2025 - Attendance Summary
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

                    {/* Calendar View */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Clock size={20} />
                            Daily Attendance Calendar
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                            {attendanceData.attendance.calendar.map((entry, index) => {
                                const dateInfo = formatDate(entry.date);
                                return (
                                    <div
                                        key={index}
                                        className="border border-slate-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
                                    >
                                        <div className="text-center">
                                            <div className="text-xs text-slate-500 uppercase font-medium mb-1">
                                                {dateInfo.weekday}
                                            </div>
                                            <div className="text-lg font-bold text-slate-900 mb-1">
                                                {dateInfo.day}
                                            </div>
                                            <div className="text-xs text-slate-500 mb-2">
                                                {dateInfo.month}
                                            </div>
                                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                                                {getStatusIcon(entry.status)}
                                                {getStatusLabel(entry.status)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};