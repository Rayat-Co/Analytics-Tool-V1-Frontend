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

    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

    // TODO: ts-ignore because percent, entry are possibly undefined.
    // @ts-ignore
    return (
        <ChartCard title="Units by Vehicle Type">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
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
        </ChartCard>
    );
};

interface TopModelsChartProps {
    data: Array<{ model: string; units: number }>;
}

export const TopModelsChart: React.FC<TopModelsChartProps> = ({ data }) => {
    return (
        <ChartCard title="Top Selling Models">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="model" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="units" fill="#3b82f6" />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
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

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

    return (
        <ChartCard title="Payment Type Distribution">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                        outerRadius={100}
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
        </ChartCard>
    );
};

interface SalespersonChartProps {
    data: Array<{ name: string; units: number; avg_gross: number }>;
}

export const SalespersonChart: React.FC<SalespersonChartProps> = ({ data }) => {
    // Filter out HOUSE and entries with 0 avg_gross
    const filteredData = data.filter(
        (person) => person.name !== 'HOUSE' && person.avg_gross > 0
    );

    return (
        <ChartCard title="Top Salespeople Performance">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                    <Tooltip
                        formatter={(value: number, name: string) => {
                            if (name === 'avg_gross') return `$${value.toFixed(0)}`;
                            return value;
                        }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="units" fill="#3b82f6" name="Units Sold" />
                    <Bar yAxisId="right" dataKey="avg_gross" fill="#10b981" name="Avg Gross ($)" />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
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
        <ChartCard title="Average Per Unit Breakdown">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    <Bar dataKey="value" fill="#8b5cf6" />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};