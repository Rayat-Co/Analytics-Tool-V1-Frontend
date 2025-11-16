import React, { useEffect, useState } from 'react';
import Dashboard from '../components/Dashboard/Dashboard';
import type {KpiResponse} from '../types/kpi.types';
import { getKpiResults } from '../api/api';
import './DashboardPage.css';

interface DashboardPageProps {
    taskId: string;
    onNewUpload: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ taskId, onNewUpload }) => {
    const [data, setData] = useState<KpiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');
                const results = await getKpiResults(taskId);
                setData(results);
            } catch (err) {
                setError('Failed to load KPI data. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [taskId]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Analyzing your data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">⚠️</div>
                <h2 className="error-title">Error Loading Data</h2>
                <p className="error-message">{error}</p>
                <button className="retry-button" onClick={onNewUpload}>
                    Try Again
                </button>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    return <Dashboard data={data} onNewUpload={onNewUpload} />;
};

export default DashboardPage;