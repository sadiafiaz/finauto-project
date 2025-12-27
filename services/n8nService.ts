interface N8nWorkflowResponse {
    success: boolean;
    data?: any;
    error?: string;
}

class N8nService {
    private baseUrl: string;
    private apiKey: string;

    constructor() {
        this.baseUrl = process.env.N8N_BASE_URL || 'http://localhost:5678';
        this.apiKey = process.env.N8N_API_KEY || '';
    }

    private async makeRequest(endpoint: string, method: string = 'POST', data?: any): Promise<N8nWorkflowResponse> {
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            if (this.apiKey) {
                headers['Authorization'] = `Bearer ${this.apiKey}`;
            }

            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method,
                headers,
                body: data ? JSON.stringify(data) : undefined,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return { success: true, data: result };
        } catch (error) {
            console.error('N8n API Error:', error);
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }

    private async makeFileRequest(endpoint: string, file: File, additionalData?: any): Promise<N8nWorkflowResponse> {
        try {
            const formData = new FormData();
            formData.append('attachment_0', file);

            if (additionalData) {
                Object.keys(additionalData).forEach(key => {
                    formData.append(key, additionalData[key]);
                });
            }

            const headers: Record<string, string> = {};

            if (this.apiKey) {
                headers['Authorization'] = `Bearer ${this.apiKey}`;
            }

            // Construct URL properly - remove trailing slash from baseUrl if present
            const baseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
            const url = `${baseUrl}/${endpoint}`;
            console.log('Making file request to:', url);

            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return { success: true, data: result };
        } catch (error) {
            console.error('N8n File Upload Error:', error);
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }

    // Trigger webhook workflows
    async triggerWebhook(webhookId: string, data: any): Promise<N8nWorkflowResponse> {
        // Don't add /webhook/ prefix since base URL already includes webhook-test
        return this.makeRequest(`/${webhookId}`, 'POST', data);
    }

    // Execute workflows by ID
    async executeWorkflow(workflowId: string, data?: any): Promise<N8nWorkflowResponse> {
        return this.makeRequest(`/api/v1/workflows/${workflowId}/execute`, 'POST', data);
    }

    // Specific workflow triggers for your finance app
    async generateInvoice(invoiceData: {
        clientName: string;
        amount: number;
        date: string;
        items?: any[];
    }): Promise<N8nWorkflowResponse> {
        return this.triggerWebhook('generate-invoice', {
            type: 'invoice_generation',
            ...invoiceData
        });
    }

    async processPayroll(employeeIds: string[]): Promise<N8nWorkflowResponse> {
        return this.triggerWebhook('process-payroll', {
            type: 'payroll_processing',
            employeeIds
        });
    }

    async sendWhatsAppNotification(message: string, phone: string): Promise<N8nWorkflowResponse> {
        return this.triggerWebhook('whatsapp-notification', {
            type: 'whatsapp_message',
            message,
            phone
        });
    }

    async analyzeExpense(expenseData: {
        vendor: string;
        amount: number;
        category: string;
        receiptUrl?: string;
    }): Promise<N8nWorkflowResponse> {
        return this.triggerWebhook('analyze-expense', {
            type: 'expense_analysis',
            ...expenseData
        });
    }

    async uploadInvoice(file: File, metadata?: {
        vendor?: string;
        expectedAmount?: number;
        category?: string;
    }): Promise<N8nWorkflowResponse> {
        const endpoint = 'invoice-upload';
        console.log(`Uploading to: ${this.baseUrl}${endpoint}`);
        return this.makeFileRequest(endpoint, file, {
            type: 'invoice_upload',
            ...metadata
        });
    }

    async generateFinancialReport(reportType: string, dateRange: { start: string; end: string }): Promise<N8nWorkflowResponse> {
        return this.triggerWebhook('generate-report', {
            type: 'financial_report',
            reportType,
            dateRange
        });
    }

    async fetchGoogleSheetsEmployees(spreadsheetId: string = '1PCMArybtF0LRHdMB2neBZsVbX2zgdOIgxQ4lu4CKUuQ'): Promise<N8nWorkflowResponse> {
        // Use the correct endpoint name
        return this.triggerWebhook('fetch-google-sheets-employees', {
            type: 'google_sheets_fetch',
            spreadsheetId,
            range: 'Sheet1!A:I' // ID, Password, Full Name, Picture URL, Designation, CNIC, Blood Group, Address, Emergency Contact
        });
    }

    async fetchEmployeeAttendance(id: string, password: string): Promise<N8nWorkflowResponse> {
        return this.triggerWebhook('fetch-employee-attendance', {
            id,
            password
        });
    }
}

export const n8nService = new N8nService();