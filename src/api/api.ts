import type {KpiResponse} from '../types/kpi.types';
import mockData from '../mocks/kpiResponse.json';

/**
 * Mock API function to simulate uploading a spreadsheet
 * In production, this will POST to /upload endpoint
 */
export async function uploadSpreadsheet(file: File): Promise<{ task_id: string }> {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Validate file
    if (!file) {
        throw new Error('No file provided');
    }

    // Return mock task ID
    return {
        task_id: `mock-${Date.now()}`,
    };
}

// TODO: ts-ignore because taskId is unused (mock data used)
// @ts-ignore
/**
 * Mock API function to retrieve KPI results
 * In production, this will GET from /kpis/{task_id} endpoint
 */
export async function getKpiResults(taskId: string): Promise<KpiResponse> {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Return mock data
    return mockData as KpiResponse;
}

/**
 * Combined function to upload and get results
 * Useful for the mock flow
 */
export async function uploadAndAnalyze(file: File): Promise<KpiResponse> {
    const { task_id } = await uploadSpreadsheet(file);
    const results = await getKpiResults(task_id);
    return results;
}