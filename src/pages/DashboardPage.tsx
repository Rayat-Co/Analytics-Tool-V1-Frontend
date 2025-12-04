import React, { useEffect, useState } from 'react';
import Dashboard from '../components/Dashboard/Dashboard';
import type {KpiResponse} from '../types/kpi.types';
import { getKpiForYearMonth, getAvailableMonthsForYear, getAvailableYears } from '../api/api';
import './DashboardPage.css';

interface DashboardPageProps {
    onLogout: () => void;
    onNavigateToUploadDeal?: () => void;
    onNavigateToMasterSheet?: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ 
    onLogout, 
    onNavigateToUploadDeal,
    onNavigateToMasterSheet 
}) => {
    const [data, setData] = useState<KpiResponse | null>(null);
    const [selectedYear, setSelectedYear] = useState<number>(2025);
    const [selectedMonth, setSelectedMonth] = useState<string>('january');
    const [availableYears, setAvailableYears] = useState<number[]>([]);
    const [availableMonths, setAvailableMonths] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    // Fetch available years on mount
    useEffect(() => {
        const fetchYears = async () => {
            try {
                const years = await getAvailableYears();
                setAvailableYears(years);
                if (years.length > 0) {
                    // Default to most recent year
                    const latestYear = Math.max(...years);
                    setSelectedYear(latestYear);
                }
            } catch (err: any) {
                console.error('Failed to load years:', err);
                if (err.message === 'Unauthorized') {
                    onLogout();
                }
            }
        };
        fetchYears();
    }, [onLogout]);

    // Fetch months when year changes
    useEffect(() => {
        const fetchMonths = async () => {
            try {
                const months = await getAvailableMonthsForYear(selectedYear);
                setAvailableMonths(months);
                if (months.length > 0) {
                    setSelectedMonth(months[0]);
                }
            } catch (err: any) {
                console.error('Failed to load months:', err);
                if (err.message === 'Unauthorized') {
                    onLogout();
                }
            }
        };
        
        if (selectedYear) {
        fetchMonths();
        }
    }, [selectedYear, onLogout]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');
                const results = await getKpiForYearMonth(selectedYear, selectedMonth);
                setData(results);
            } catch (err: any) {
                if (err.message === 'Unauthorized') {
                    onLogout();
                    return;
                }
                setError('Failed to load KPI data. Please make sure the backend is running.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (selectedYear && selectedMonth) {
            fetchData();
        }
    }, [selectedYear, selectedMonth, onLogout]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading dealership analytics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">⚠️</div>
                <h2 className="error-title">Error Loading Data</h2>
                <p className="error-message">{error}</p>
                <button className="retry-button" onClick={() => window.location.reload()}>
                    Retry
                </button>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <Dashboard 
            data={data} 
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            availableYears={availableYears}
            availableMonths={availableMonths}
            onYearChange={setSelectedYear}
            onMonthChange={setSelectedMonth}
            onLogout={onLogout}
            onNavigateToUploadDeal={onNavigateToUploadDeal}
            onNavigateToMasterSheet={onNavigateToMasterSheet}
        />
    );
};

export default DashboardPage;