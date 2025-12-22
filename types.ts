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
