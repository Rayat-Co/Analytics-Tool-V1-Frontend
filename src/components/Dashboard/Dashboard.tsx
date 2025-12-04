import React, { useState } from 'react';
import {
    VehicleTypeChart,
    TopModelsChart,
    PaymentTypeChart,
    SalespersonChart
} from './KpiChart';
import type { KpiResponse } from '../../types/kpi.types';
import {
    formatCurrency,
    formatPercentage,
    formatNumber
} from '../../utils/formatters';
import './Dashboard.css';

interface DashboardProps {
    data: KpiResponse;
    selectedYear: number;
    selectedMonth: string;
    availableYears: number[];
    availableMonths: string[];
    onYearChange: (year: number) => void;
    onMonthChange: (month: string) => void;
    onLogout: () => void;
    onNavigateToUploadDeal?: () => void;
    onNavigateToMasterSheet?: () => void;
}

type SalespersonMetric = 'deal_gross' | 'total_gross' | 'commission';

const Dashboard: React.FC<DashboardProps> = ({
    data,
    selectedYear,
    selectedMonth,
    availableYears,
    availableMonths,
    onYearChange,
    onMonthChange,
    onLogout,
    onNavigateToUploadDeal,
    onNavigateToMasterSheet
}) => {
    const [salespersonMetric, setSalespersonMetric] = useState<SalespersonMetric>('deal_gross');
    const [showKpiSelector, setShowKpiSelector] = useState(false);
    const [visibleKpis, setVisibleKpis] = useState({
        dealVolume: true,
        avgGross: true,
        fiRate: true,
        commission: true,
        avgUnitsPerSP: true,
        newUsedRatio: true,
        frontBackRatio: true,
        commissionPct: true,
        fiPctGross: true,
        totalGross: true,
        totalFiGross: true,
        totalCommission: true,
        adminFeeCount: true
    });

    const toggleKpi = (kpi: keyof typeof visibleKpis) => {
        setVisibleKpis(prev => ({ ...prev, [kpi]: !prev[kpi] }));
    };

    const getSalespersonValue = (person: any) => {
        switch (salespersonMetric) {
            case 'deal_gross':
                return person.avg_deal_gross;
            case 'total_gross':
                return person.avg_total_gross;
            case 'commission':
                return person.avg_commission;
            default:
                return person.avg_deal_gross;
        }
    };

    const getSalespersonLabel = () => {
        switch (salespersonMetric) {
            case 'deal_gross':
                return 'Avg Deal Gross';
            case 'total_gross':
                return 'Avg Total Gross';
            case 'commission':
                return 'Avg Commission';
            default:
                return 'Avg Deal Gross';
        }
    };

    return (
        <div className="dashboard-layout">
            {/* Top Navigation Bar */}
            <header className="dashboard-navbar">
                <div className="navbar-content">
                    <h1 className="navbar-title">Ford Dealership Analytics</h1>
                    <div className="navbar-controls">
                        <button
                            className="kpi-selector-btn"
                            onClick={() => setShowKpiSelector(!showKpiSelector)}
                        >
                            ⚙️ Configure KPIs
                        </button>
                        <div className="year-selector-wrapper">
                            <label htmlFor="year-select">Year:</label>
                            <select
                                id="year-select"
                                className="year-selector"
                                value={selectedYear}
                                onChange={(e) => onYearChange(Number(e.target.value))}
                            >
                                {availableYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="month-selector-wrapper">
                            <label htmlFor="month-select">Month:</label>
                            <select
                                id="month-select"
                                className="month-selector"
                                value={selectedMonth}
                                onChange={(e) => onMonthChange(e.target.value)}
                            >
                                {availableMonths.map((month) => (
                                    <option key={month} value={month}>
                                        {month.charAt(0).toUpperCase() + month.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            className="upload-nav-btn"
                            onClick={onNavigateToUploadDeal}
                            title="Upload Deal Summary"
                            style={{ background: '#10b981' }}
                        >
                            📄 Upload Deal
                        </button>
                        <button
                            className="upload-nav-btn"
                            onClick={onNavigateToMasterSheet}
                            title="View Master Sheet"
                            style={{ background: '#3b82f6' }}
                        >
                            📊 Master Sheet
                        </button>
                        <button
                            className="logout-btn"
                            onClick={onLogout}
                            title="Logout"
                        >
                            🚪 Logout
                        </button>
                    </div>
                </div>

                {/* KPI Selector Dropdown */}
                {showKpiSelector && (
                    <div className="kpi-selector-dropdown">
                        <h3>Primary Metrics</h3>
                        <label className="kpi-checkbox">
                            <input type="checkbox" checked={visibleKpis.dealVolume} onChange={() => toggleKpi('dealVolume')} />
                            <span>Deal Volume</span>
                        </label>
                        <label className="kpi-checkbox">
                            <input type="checkbox" checked={visibleKpis.avgGross} onChange={() => toggleKpi('avgGross')} />
                            <span>Avg Gross Per Unit</span>
                        </label>
                        <label className="kpi-checkbox">
                            <input type="checkbox" checked={visibleKpis.fiRate} onChange={() => toggleKpi('fiRate')} />
                            <span>F&I Penetration Rate</span>
                        </label>
                        <label className="kpi-checkbox">
                            <input type="checkbox" checked={visibleKpis.commission} onChange={() => toggleKpi('commission')} />
                            <span>Commission Per Unit</span>
                        </label>

                        <h3 className="kpi-section-divider">Efficiency Metrics</h3>
                        <label className="kpi-checkbox">
                            <input type="checkbox" checked={visibleKpis.avgUnitsPerSP} onChange={() => toggleKpi('avgUnitsPerSP')} />
                            <span>Avg Units Per Salesperson</span>
                        </label>
                        <label className="kpi-checkbox">
                            <input type="checkbox" checked={visibleKpis.newUsedRatio} onChange={() => toggleKpi('newUsedRatio')} />
                            <span>New/Used Ratio</span>
                        </label>
                        <label className="kpi-checkbox">
                            <input type="checkbox" checked={visibleKpis.frontBackRatio} onChange={() => toggleKpi('frontBackRatio')} />
                            <span>Front/Back Ratio</span>
                        </label>

                        <h3 className="kpi-section-divider">Percentage Metrics</h3>
                        <label className="kpi-checkbox">
                            <input type="checkbox" checked={visibleKpis.commissionPct} onChange={() => toggleKpi('commissionPct')} />
                            <span>Commission % of Gross</span>
                        </label>
                        <label className="kpi-checkbox">
                            <input type="checkbox" checked={visibleKpis.fiPctGross} onChange={() => toggleKpi('fiPctGross')} />
                            <span>F&I % of Total Gross</span>
                        </label>

                        <h3 className="kpi-section-divider">Total Metrics</h3>
                        <label className="kpi-checkbox">
                            <input type="checkbox" checked={visibleKpis.totalGross} onChange={() => toggleKpi('totalGross')} />
                            <span>Total Deal Gross</span>
                        </label>
                        <label className="kpi-checkbox">
                            <input type="checkbox" checked={visibleKpis.totalFiGross} onChange={() => toggleKpi('totalFiGross')} />
                            <span>Total F&I Gross</span>
                        </label>
                        <label className="kpi-checkbox">
                            <input type="checkbox" checked={visibleKpis.totalCommission} onChange={() => toggleKpi('totalCommission')} />
                            <span>Total Commission</span>
                        </label>
                        <label className="kpi-checkbox">
                            <input type="checkbox" checked={visibleKpis.adminFeeCount} onChange={() => toggleKpi('adminFeeCount')} />
                            <span>Admin Fee Count</span>
                        </label>
                    </div>
                )}
            </header>

            <div className="dashboard-main">
                {/* Left Sidebar - Sales & F&I People */}
                <aside className="dashboard-sidebar">
                    <div className="sidebar-section">
                        <h2 className="sidebar-title">Sales Performance</h2>
                        <div className="sidebar-stats">
                            <div className="stat-item">
                                <span className="stat-label">Total Units</span>
                                <span className="stat-value">{data.total_units_sold}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Avg Gross/Unit</span>
                                <span className="stat-value">{formatCurrency(data.avg_gross_per_unit)}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Total Gross</span>
                                <span className="stat-value">{formatCurrency((data as any).stats?.total_final_deal_gross || 0)}</span>
                            </div>
                        </div>

                        <div className="subsection-header">
                            <h3 className="subsection-title">Top 8 Sales People</h3>
                            <select
                                className="metric-selector"
                                value={salespersonMetric}
                                onChange={(e) => setSalespersonMetric(e.target.value as SalespersonMetric)}
                            >
                                <option value="deal_gross">Avg Deal Gross</option>
                                <option value="total_gross">Avg Total Gross</option>
                                <option value="commission">Avg Commission</option>
                            </select>
                        </div>
                        <div className="people-list">
                            {data.top_salespeople.slice(0, 8).map((person, index) => {
                                const value = getSalespersonValue(person);
                                return (
                                    <div key={index} className="person-item">
                                        <div className="person-info">
                                            <span className="person-rank">#{index + 1}</span>
                                            <span className="person-name">{person.name}</span>
                                        </div>
                                        <div className="person-stats">
                                            <span className="person-units">{person.units} units</span>
                                            <span className="person-gross">{value > 0 ? formatCurrency(value) : 'N/A'}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="sidebar-section">
                        <h2 className="sidebar-title">F&I Performance</h2>
                        <div className="sidebar-stats">
                            <div className="stat-item">
                                <span className="stat-label">F&I Penetration</span>
                                <span className="stat-value stat-highlight">{formatPercentage(data.fi_penetration_rate)}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Avg F&I/Unit</span>
                                <span className="stat-value">{formatCurrency(data.avg_fi_per_unit)}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Total F&I Gross</span>
                                <span className="stat-value">{formatCurrency((data as any).stats?.total_fi_gross || 0)}</span>
                            </div>
                        </div>

                        <h3 className="subsection-title">Top 8 F&I Producers</h3>
                        <div className="people-list">
                            {(data as any).salesperson_performance?.salesperson_fi_gross &&
                                Object.entries((data as any).salesperson_performance.salesperson_fi_gross)
                                    .sort((a: any, b: any) => b[1] - a[1])
                                    .slice(0, 8)
                                    .map(([name, gross]: [string, any], index: number) => (
                                        <div key={index} className="person-item">
                                            <div className="person-info">
                                                <span className="person-rank">#{index + 1}</span>
                                                <span className="person-name">{name}</span>
                                            </div>
                                            <div className="person-stats">
                                                <span className="person-gross">{formatCurrency(gross)}</span>
                                            </div>
                                        </div>
                                    ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content - Charts and Analytics */}
                <main className="dashboard-content">
                    {/* Key Metrics Row */}
                    <section className="metrics-section">
                        {visibleKpis.dealVolume && (
                            <div className="metric-card">
                                <h3 className="metric-title">Deal Volume</h3>
                                <div className="metric-value">{data.total_units_sold}</div>
                                <div className="metric-subtitle">Units Sold</div>
                            </div>
                        )}
                        {visibleKpis.avgGross && (
                            <div className="metric-card">
                                <h3 className="metric-title">Avg Gross</h3>
                                <div className="metric-value">{formatCurrency(data.avg_gross_per_unit)}</div>
                                <div className="metric-subtitle">Per Unit</div>
                            </div>
                        )}
                        {visibleKpis.fiRate && (
                            <div className="metric-card">
                                <h3 className="metric-title">F&I Rate</h3>
                                <div className="metric-value">{formatPercentage(data.fi_penetration_rate)}</div>
                                <div className="metric-subtitle">Penetration</div>
                            </div>
                        )}
                        {visibleKpis.commission && (
                            <div className="metric-card">
                                <h3 className="metric-title">Commission</h3>
                                <div className="metric-value">{formatCurrency(data.avg_commission_per_unit)}</div>
                                <div className="metric-subtitle">Per Unit</div>
                            </div>
                        )}
                        {visibleKpis.avgUnitsPerSP && (
                            <div className="metric-card">
                                <h3 className="metric-title">Units/Salesperson</h3>
                                <div className="metric-value">{formatNumber(data.avg_units_per_salesperson)}</div>
                                <div className="metric-subtitle">Average Productivity</div>
                            </div>
                        )}
                        {visibleKpis.newUsedRatio && (
                            <div className="metric-card">
                                <h3 className="metric-title">New/Used Ratio</h3>
                                <div className="metric-value">{formatNumber(data.new_used_ratio)}</div>
                                <div className="metric-subtitle">New to Used</div>
                            </div>
                        )}
                        {visibleKpis.frontBackRatio && (
                            <div className="metric-card">
                                <h3 className="metric-title">Front/Back Ratio</h3>
                                <div className="metric-value">{formatNumber(data.front_back_ratio)}</div>
                                <div className="metric-subtitle">Deal to F&I Gross</div>
                            </div>
                        )}
                        {visibleKpis.commissionPct && (
                            <div className="metric-card">
                                <h3 className="metric-title">Commission %</h3>
                                <div className="metric-value">{formatPercentage(data.commission_as_pct_of_gross)}</div>
                                <div className="metric-subtitle">% of Total Gross</div>
                            </div>
                        )}
                        {visibleKpis.fiPctGross && (
                            <div className="metric-card">
                                <h3 className="metric-title">F&I % of Gross</h3>
                                <div className="metric-value">{formatPercentage(data.fi_as_pct_of_total_gross)}</div>
                                <div className="metric-subtitle">F&I Contribution</div>
                            </div>
                        )}
                        {visibleKpis.totalGross && (
                            <div className="metric-card">
                                <h3 className="metric-title">Total Gross</h3>
                                <div className="metric-value">{formatCurrency((data as any).stats?.total_final_deal_gross || 0)}</div>
                                <div className="metric-subtitle">Total Deal Gross</div>
                            </div>
                        )}
                        {visibleKpis.totalFiGross && (
                            <div className="metric-card">
                                <h3 className="metric-title">Total F&I</h3>
                                <div className="metric-value">{formatCurrency((data as any).stats?.total_fi_gross || 0)}</div>
                                <div className="metric-subtitle">Total F&I Gross</div>
                            </div>
                        )}
                        {visibleKpis.totalCommission && (
                            <div className="metric-card">
                                <h3 className="metric-title">Total Commission</h3>
                                <div className="metric-value">{formatCurrency((data as any).stats?.total_sales_commission || 0)}</div>
                                <div className="metric-subtitle">Total Sales Comm</div>
                            </div>
                        )}
                        {visibleKpis.adminFeeCount && (
                            <div className="metric-card metric-highlight">
                                <h3 className="metric-title">Admin Fee</h3>
                                <div className="metric-value">{(data as any).stats?.admin_fee_count ?? 0}</div>
                                <div className="metric-subtitle">Deals with Admin Fee</div>
                            </div>
                        )}
                    </section>

                    {/* Charts Grid */}
                    <section className="charts-section">
                        <div className="chart-row">
                            <div className="chart-container">
                                <h3 className="chart-title">Vehicle Type Distribution</h3>
                                <VehicleTypeChart data={data.units_by_vehicle_type} />
                            </div>
                            <div className="chart-container">
                                <h3 className="chart-title">Payment Type Breakdown</h3>
                                <PaymentTypeChart data={data.lease_finance_cash_ratio} />
                            </div>
                        </div>

                        <div className="chart-row">
                            <div className="chart-container chart-wide">
                                <h3 className="chart-title">Top 10 Models Sold</h3>
                                <TopModelsChart data={data.top_models} />
                            </div>
                        </div>

                        <div className="chart-row">
                            <div className="chart-container chart-wide">
                                <h3 className="chart-title">Salesperson Performance</h3>
                                <SalespersonChart data={data.top_salespeople} />
                            </div>
                        </div>

                        {/* Additional KPI Cards */}
                        <div className="kpi-cards-grid">
                            <div className="kpi-card-small">
                                <div className="kpi-label">New/Used Ratio</div>
                                <div className="kpi-value-small">{formatNumber(data.new_used_ratio)}</div>
                            </div>
                            <div className="kpi-card-small">
                                <div className="kpi-label">Front/Back Ratio</div>
                                <div className="kpi-value-small">{formatNumber(data.front_back_ratio)}</div>
                            </div>
                            <div className="kpi-card-small">
                                <div className="kpi-label">Avg Units/SP</div>
                                <div className="kpi-value-small">{formatNumber(data.avg_units_per_salesperson)}</div>
                            </div>
                            <div className="kpi-card-small">
                                <div className="kpi-label">Commission %</div>
                                <div className="kpi-value-small">{formatPercentage(data.commission_as_pct_of_gross)}</div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;