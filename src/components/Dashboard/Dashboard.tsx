import React from 'react';
import KpiCard from './KpiCard';
import InsightsPanel from './InsightsPanel';
import {
    VehicleTypeChart,
    TopModelsChart,
    PaymentTypeChart,
    SalespersonChart,
    ProfitabilityChart
} from './KpiChart';
import type {KpiResponse} from '../../types/kpi.types';
import {
    formatCurrency,
    formatPercentage,
    formatNumber,
    formatRatio
} from '../../utils/formatters';
import './Dashboard.css';

interface DashboardProps {
    data: KpiResponse;
    onNewUpload: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onNewUpload }) => {
    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1 className="dashboard-title">Dealership Analytics Dashboard</h1>
                    <p className="dashboard-subtitle">
                        Performance Report for {data.month}
                    </p>
                </div>
                <button className="new-upload-button" onClick={onNewUpload}>
                    + New Upload
                </button>
            </div>

            {/* Insights Section */}
            <div className="dashboard-section">
                <InsightsPanel insights={data.insights} />
            </div>

            {/* Deal Volume & Efficiency */}
            <div className="dashboard-section">
                <h2 className="section-title">Deal Volume & Efficiency</h2>
                <div className="kpi-grid">
                    <KpiCard
                        title="Total Units Sold"
                        value={data.total_units_sold}
                        subtitle="Total closed deals this month"
                    />
                    <KpiCard
                        title="Avg Units Per Salesperson"
                        value={formatNumber(data.avg_units_per_salesperson)}
                        subtitle="Average productivity"
                    />
                    <KpiCard
                        title="Avg Gross Per Unit"
                        value={formatCurrency(data.avg_gross_per_unit)}
                        subtitle="Average deal profitability"
                    />
                    <KpiCard
                        title="Avg F&I Per Unit"
                        value={formatCurrency(data.avg_fi_per_unit)}
                        subtitle="Average F&I gross per deal"
                    />
                    <KpiCard
                        title="Avg Commission Per Unit"
                        value={formatCurrency(data.avg_commission_per_unit)}
                        subtitle="Average salesperson commission"
                    />
                    <KpiCard
                        title="F&I Penetration Rate"
                        value={formatPercentage(data.fi_penetration_rate)}
                        subtitle="Deals with F&I products"
                    />
                </div>
            </div>

            {/* Deal Composition & Profitability */}
            <div className="dashboard-section">
                <h2 className="section-title">Deal Composition & Profitability</h2>
                <div className="kpi-grid">
                    <KpiCard
                        title="New vs Used Ratio"
                        value={formatRatio(data.new_used_ratio)}
                        subtitle="New to used vehicle ratio"
                    />

                    <KpiCard
                        title="Front vs Back Ratio"
                        value={formatRatio(data.front_back_ratio)}
                        subtitle="Front-end to back-end gross"
                    />
                    <KpiCard
                        title="Commission % of Gross"
                        value={formatPercentage(data.commission_as_pct_of_gross)}
                        subtitle="Commissions as % of total gross"
                    />
                    <KpiCard
                        title="F&I % of Total Gross"
                        value={formatPercentage(data.fi_as_pct_of_total_gross)}
                        subtitle="F&I contribution to gross"
                    />
                </div>
            </div>

            {/* Payment Type Distribution */}
            <div className="dashboard-section">
                <h2 className="section-title">Payment Type Distribution</h2>
                <div className="kpi-grid">
                    <KpiCard
                        title="Lease"
                        value={formatPercentage(data.lease_finance_cash_ratio.lease)}
                        subtitle="Lease deals"
                    />
                    <KpiCard
                        title="Finance"
                        value={formatPercentage(data.lease_finance_cash_ratio.finance)}
                        subtitle="Finance deals"
                    />
                    <KpiCard
                        title="Cash"
                        value={formatPercentage(data.lease_finance_cash_ratio.cash)}
                        subtitle="Cash deals"
                    />
                </div>
            </div>

            {/* Top Performers */}
            <div className="dashboard-section">
                <h2 className="section-title">Top Performers</h2>
                <div className="table-container">
                    <table className="performers-table">
                        <thead>
                        <tr>
                            <th>Salesperson</th>
                            <th>Units Sold</th>
                            <th>Avg Gross</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.top_salespeople.map((person, index) => (
                            <tr key={index}>
                                <td className="salesperson-name">
                                    <span className="rank-badge">{index + 1}</span>

                                    {person.name}
                                </td>
                                <td>{person.units}</td>
                                <td>{person.avg_gross > 0 ? formatCurrency(person.avg_gross) : 'N/A'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Vehicle Insights */}
            <div className="dashboard-section">
                <h2 className="section-title">Vehicle Insights</h2>
                <div className="charts-grid">
                    <VehicleTypeChart data={data.units_by_vehicle_type} />
                    <TopModelsChart data={data.top_models} />
                </div>
            </div>

            {/* Payment & Profitability Charts */}
            <div className="dashboard-section">
                <h2 className="section-title">Financial Analysis</h2>
                <div className="charts-grid">
                    <PaymentTypeChart data={data.lease_finance_cash_ratio} />
                    <ProfitabilityChart data={{
                        avg_gross_per_unit: data.avg_gross_per_unit,
                        avg_fi_per_unit: data.avg_fi_per_unit,
                        avg_commission_per_unit: data.avg_commission_per_unit
                    }} />
                </div>
            </div>

            {/* Salesperson Performance Chart */}
            <div className="dashboard-section">
                <h2 className="section-title">Salesperson Analytics</h2>
                <SalespersonChart data={data.top_salespeople} />
            </div>

            {/* Footer */}
            <div className="dashboard-footer">
                <p>Last updated: {new Date().toLocaleString()}</p>
            </div>
        </div>
    );
};

export default Dashboard;