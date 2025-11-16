import React from 'react';
import './InsightsPanel.css';

interface InsightsPanelProps {
    insights: string;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ insights }) => {
    return (
        <div className="insights-panel">
            <div className="insights-header">
                <span className="insights-icon">💡</span>
                <h3 className="insights-title">AI Insights</h3>
            </div>
            <p className="insights-text">{insights}</p>
        </div>
    );
};

export default InsightsPanel;