export interface KpiResponse {
    month: string;
    total_units_sold: number;
    avg_units_per_salesperson: number;
    avg_gross_per_unit: number;
    avg_fi_per_unit: number;
    avg_commission_per_unit: number;
    fi_penetration_rate: number;
    new_used_ratio: number;
    lease_finance_cash_ratio: {
        lease: number;
        finance: number;
        cash: number;
    };
    front_back_ratio: number;
    commission_as_pct_of_gross: number;
    fi_as_pct_of_total_gross: number;
    top_salespeople: Salesperson[];
    units_by_vehicle_type: {
        [key: string]: number;
    };
    top_models: Model[];
    insights: string;
}

export interface Salesperson {
    name: string;
    units: number;
    avg_gross: number;
}

export interface Model {
    model: string;
    units: number;
}