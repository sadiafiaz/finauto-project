import { Employee, Expense, Invoice, RiskLevel, Status } from './types';

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'EMP101', name: 'Ali Raza', role: 'Software Engineer', email: 'ali@finauto.com', department: 'IT', salary: 150000, status: 'Active', lastPayrollRun: '2023-10-25' },
  { id: 'EMP102', name: 'Sara Khan', role: 'HR Manager', email: 'sara@finauto.com', department: 'HR', salary: 120000, status: 'Active', lastPayrollRun: '2023-10-25' },
  { id: 'EMP103', name: 'Ahmed Bilal', role: 'Sales Executive', email: 'ahmed@finauto.com', department: 'Sales', salary: 90000, status: 'On Leave', lastPayrollRun: '2023-09-25' },
];

export const MOCK_EXPENSES: Expense[] = [
  { id: 'EXP001', vendor: 'AWS Services', date: '2023-10-28', amount: 450.00, category: 'Software', status: Status.APPROVED, riskLevel: RiskLevel.LOW, description: 'Monthly cloud hosting bill' },
  { id: 'EXP002', vendor: 'Pearl Continental', date: '2023-10-27', amount: 12000.00, category: 'Travel', status: Status.PENDING, riskLevel: RiskLevel.MEDIUM, description: 'Client dinner meeting' },
  { id: 'EXP003', vendor: 'Unknown Vendor', date: '2023-10-26', amount: 50000.00, category: 'Supplies', status: Status.REJECTED, riskLevel: RiskLevel.HIGH, description: 'Suspicious large purchase' },
  { id: 'EXP004', vendor: 'Zoom Video', date: '2023-10-25', amount: 14.99, category: 'Software', status: Status.APPROVED, riskLevel: RiskLevel.LOW },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2023-001', number: 'INV-1001', clientName: 'TechCorp Solutions', amount: 2500.00, date: '2023-10-15', dueDate: '2023-10-30', status: Status.PAID, type: 'Sales' },
  { id: 'INV-2023-002', number: 'INV-1002', clientName: 'Global Traders', amount: 4800.00, date: '2023-10-20', dueDate: '2023-11-04', status: Status.PENDING, type: 'Sales' },
  { id: 'PUR-2023-001', number: 'BILL-599', clientName: 'Office Depot', amount: 350.00, date: '2023-10-18', dueDate: '2023-11-18', status: Status.APPROVED, type: 'Purchase' },
];
