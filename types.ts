export enum Status {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  PAID = 'Paid',
  OVERDUE = 'Overdue'
}

export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  department: string;
  salary: number;
  status: 'Active' | 'On Leave';
  lastPayrollRun?: string;
}

export interface GoogleSheetsEmployee {
  id: string;
  password: string;
  fullName: string;
  pictureUrl: string;
  designation: string;
  cnic: string;
  bloodGroup: string;
  address: string;
  emergencyContact: string;
  status: 'Active' | 'Inactive';
}

export interface AttendanceSummary {
  P: number; // Present
  A: number; // Absent
  L: number; // Late
}

export interface AttendanceCalendarEntry {
  date: string;
  status: 'P' | 'A' | 'L';
}

export interface AttendanceEmployee {
  employee_id: string;
  name: string;
  email: string;
  phone: string;
  basic_salary: number;
  allowance: number;
  bank_account: string;
  ifsc_code: string;
  department: string;
  joining_date: string;
  created_at: string;
}

export interface AttendanceDetails {
  success: boolean;
  employee: AttendanceEmployee;
  attendance: {
    summary: AttendanceSummary;
    calendar: AttendanceCalendarEntry[];
  };
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
  checkIn?: string;
  checkOut?: string;
}

export interface Expense {
  id: string;
  vendor: string;
  date: string;
  amount: number;
  category: string;
  status: Status;
  riskLevel: RiskLevel;
  receiptUrl?: string;
  description?: string;
}

export interface Invoice {
  id: string;
  number: string;
  clientName: string;
  amount: number;
  date: string;
  dueDate: string;
  status: Status;
  type: 'Sales' | 'Purchase';
  items?: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  intent?: string; // e.g., 'salary_report', 'profit_loss'
}
