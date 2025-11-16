export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

export const formatCurrencyDetailed = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

export const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
};

export const formatNumber = (value: number, decimals: number = 1): string => {
    return value.toFixed(decimals);
};

export const formatRatio = (value: number): string => {
    return value.toFixed(2);
};