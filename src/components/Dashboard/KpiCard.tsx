import React from 'react';
import './KpiCard.css';

interface KpiCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: string;
    trend?: {
        direction: 'up' | 'down';
        value: string;
    };
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, subtitle, icon, trend }) => {
    return (
        <div className="kpi-card">
            <div className="kpi-header">
                <div className="kpi-title-section">
                    {icon && <span className="kpi-icon">{icon}</span>}
                    <h3 className="kpi-title">{title}</h3>
                </div>
                {trend && (
                    <div className={`kpi-trend ${trend.direction}`}>
            <span className="trend-arrow">
              {trend.direction === 'up' ? '↑' : '↓'}
            </span>
                        <span className="trend-value">{trend.value}</span>
                    </div>
                )}
            </div>
            <div className="kpi-value">{value}</div>
            {subtitle && <div className="kpi-subtitle">{subtitle}</div>}
        </div>
    );
};

export default KpiCard;