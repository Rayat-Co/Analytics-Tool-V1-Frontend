import type {KpiResponse} from '../types/kpi.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

interface LoginResponse {
    access_token: string;
    token_type: string;
    username: string;
}

function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    if (!token) {
        return {};
    }
    return {
        'Authorization': `Bearer ${token}`
    };
}

/**
 * Login with username and password
 */
export async function login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    return await response.json() as LoginResponse;
}

/**
 * Logout - clear local storage
 */
export function logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
}

/**
 * Get list of available years
 */
export async function getAvailableYears(): Promise<number[]> {
    const response = await fetch(`${API_BASE_URL}/api/years`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        if (response.status === 401) {
            logout();
            throw new Error('Unauthorized');
        }
        throw new Error('Failed to fetch available years');
    }
    return response.json();
}

/**
 * Get list of available months for a specific year
 */
export async function getAvailableMonthsForYear(year: number): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/api/months/${year}`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        if (response.status === 401) {
            logout();
            throw new Error('Unauthorized');
        }
        throw new Error('Failed to fetch available months');
    }
    return response.json();
}

/**
 * Get list of available months (legacy - defaults to 2024)
 */
export async function getAvailableMonths(): Promise<string[]> {
    return getAvailableMonthsForYear(2024);
}

/**
 * Get KPIs for a specific year and month
 */
export async function getKpiForYearMonth(year: number, month: string): Promise<KpiResponse> {
    const response = await fetch(`${API_BASE_URL}/api/kpis/${year}/${month}`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        if (response.status === 401) {
            logout();
            throw new Error('Unauthorized');
        }
        throw new Error(`Failed to fetch KPIs for ${month} ${year}`);
    }
    return response.json();
}

/**
 * Get KPIs for a specific month (legacy - defaults to 2024)
 */
export async function getKpiForMonth(month: string): Promise<KpiResponse> {
    return getKpiForYearMonth(2024, month);
}

/**
 * Get KPIs for all months
 */
export async function getAllKpis(): Promise<Record<string, KpiResponse>> {
    const response = await fetch(`${API_BASE_URL}/api/kpis`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        if (response.status === 401) {
            logout();
            throw new Error('Unauthorized');
        }
        throw new Error('Failed to fetch all KPIs');
    }
    return response.json();
}

/**
 * Legacy function for compatibility - returns first available month
 */
export async function getKpiResults(taskId: string): Promise<KpiResponse> {
    // Get January as default
    return getKpiForMonth('january');
}

// ==============================================================================
// S3 UPLOAD FUNCTIONS
// ==============================================================================

interface S3UploadResponse {
    success: boolean;
    message: string;
    s3_key?: string;
    filename?: string;
}

interface S3StatusResponse {
    configured: boolean;
    message: string;
}

/**
 * Check S3 configuration status
 */
export async function checkS3Status(): Promise<S3StatusResponse> {
    const response = await fetch(`${API_BASE_URL}/api/s3/status`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        if (response.status === 401) {
            logout();
            throw new Error('Unauthorized');
        }
        throw new Error('Failed to check S3 status');
    }
    return response.json();
}

/**
 * Upload a file to S3
 */
export async function uploadFileToS3(file: File): Promise<S3UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE_URL}/api/s3/upload`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
            // Note: Don't set Content-Type for FormData, browser will set it with boundary
        },
        body: formData
    });

    if (!response.ok) {
        if (response.status === 401) {
            logout();
            throw new Error('Unauthorized');
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
    }

    return response.json();
}