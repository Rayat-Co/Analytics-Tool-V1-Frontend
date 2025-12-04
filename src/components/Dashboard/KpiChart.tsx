import React from 'react';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import './KpiChart.css';

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
    return (
        <div className="chart-card">
            <h3 className="chart-title">{title}</h3>
            <div className="chart-content">{children}</div>
        </div>
    );
};

interface VehicleTypeChartProps {
    data: { [key: string]: number };
}

export const VehicleTypeChart: React.FC<VehicleTypeChartProps> = ({ data }) => {
    const chartData = Object.entries(data).map(([name, value]) => ({
        name,
        units: value,
    }));

    const COLORS = ['#24477F', '#4a6fa5', '#7096d1', '#96b8e8'];

    return (
        <ResponsiveContainer width="100%" height={320}>
            <PieChart margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="units"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    );
};

interface TopModelsChartProps {
    data: Array<{ model: string; units: number }>;
}

export const TopModelsChart: React.FC<TopModelsChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                    dataKey="model" 
                    type="category" 
                    width={120} 
                    tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="units" fill="#24477F" />
            </BarChart>
        </ResponsiveContainer>
    );
};

interface PaymentTypeChartProps {
    data: {
        lease: number;
        finance: number;
        cash: number;
    };
}

export const PaymentTypeChart: React.FC<PaymentTypeChartProps> = ({ data }) => {
    const chartData = [
        { name: 'Lease', value: data.lease * 100, fullValue: data.lease },
        { name: 'Finance', value: data.finance * 100, fullValue: data.finance },
        { name: 'Cash', value: data.cash * 100, fullValue: data.cash },
    ];

    const COLORS = ['#24477F', '#4a6fa5', '#7096d1'];

    return (
        <ResponsiveContainer width="100%" height={320}>
            <PieChart margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
            </PieChart>
        </ResponsiveContainer>
    );
};

interface SalespersonChartProps {
    data: Array<{ name: string; units: number; avg_deal_gross: number; avg_total_gross: number; avg_commission: number }>;
}

export const SalespersonChart: React.FC<SalespersonChartProps> = ({ data }) => {
    // Filter out HOUSE and entries with 0 avg_deal_gross
    const filteredData = data.filter(
        (person) => person.name !== 'HOUSE' && person.avg_deal_gross > 0
    );

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#24477F" />
                <YAxis yAxisId="right" orientation="right" stroke="#4a6fa5" />
                <Tooltip
                    formatter={(value: number, name: string) => {
                        if (name === 'avg_deal_gross') return `$${value.toFixed(0)}`;
                        return value;
                    }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="units" fill="#24477F" name="Units Sold" />
                <Bar yAxisId="right" dataKey="avg_deal_gross" fill="#4a6fa5" name="Avg Deal Gross ($)" />
            </BarChart>
        </ResponsiveContainer>
    );
};

interface ProfitabilityChartProps {
    data: {
        avg_gross_per_unit: number;
        avg_fi_per_unit: number;
        avg_commission_per_unit: number;
    };
}

export const ProfitabilityChart: React.FC<ProfitabilityChartProps> = ({ data }) => {
    const chartData = [
        { category: 'Total Gross', value: data.avg_gross_per_unit },
        { category: 'F&I', value: data.avg_fi_per_unit },
        { category: 'Commission', value: data.avg_commission_per_unit },
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Bar dataKey="value" fill="#24477F" />
            </BarChart>
        </ResponsiveContainer>
    );
};