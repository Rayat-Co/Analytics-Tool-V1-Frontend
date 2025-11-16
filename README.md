# Car Dealership Analytics Dashboard

React + TypeScript frontend for dealership KPI visualization. Backend (FastAPI) in development - currently uses mock data.

## Quick Start (Vite)

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or 3000 or whichever)

## Tech Stack

- **React 18** + **TypeScript**
- **Recharts** for data visualization
- Mock API calls (ready for FastAPI integration)

## Project Structure

```
src/
├── components/
│   ├── UploadSpreadsheet.tsx      # File upload with drag-drop
│   └── Dashboard/
│       ├── Dashboard.tsx           # Main dashboard layout
│       ├── KpiCard.tsx            # Reusable metric cards
│       ├── KpiChart.tsx           # 5 chart components (Recharts)
│       └── InsightsPanel.tsx      # AI insights display
├── pages/
│   ├── Home.tsx                   # Upload page
│   └── DashboardPage.tsx          # Dashboard with loading/error states
├── api/
│   └── api.ts                     # Mock API (replace with real endpoints)
├── mocks/
│   └── kpiResponse.json           # Mock KPI data
├── types/
│   └── kpi.types.ts               # TypeScript interfaces
└── utils/
    └── formatters.ts              # Currency/percentage formatters
```

## Features

- **Upload**: Drag-drop/browse for .xlsx/.csv files (10MB max)
- **KPIs**: 15+ metrics across 5 categories (volume, profitability, composition)
- **Charts**: Pie charts (vehicle types, payment distribution), bar charts (models, salespeople, profitability)
- **Responsive**: Mobile-friendly grid layout
- **Loading/Error States**: Animated spinner, error handling

## KPIs Displayed

**Deal Volume**: Total units, avg per salesperson, avg gross/F&I/commission per unit, F&I penetration  
**Composition**: New/used ratio, front/back ratio, commission %, F&I %  
**Payment Types**: Lease/finance/cash breakdown  
**Top Performers**: Salesperson table with units & avg gross  
**Vehicles**: Units by type (SUV/Sedan/Truck), top models

## API Integration (TODO)

Currently mocked in `src/api/api.ts`. Replace with:

```typescript
// POST /upload - returns { task_id }
export async function uploadSpreadsheet(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('http://your-backend/upload', {
    method: 'POST',
    body: formData,
  });
  return response.json();
}

// GET /kpis/{task_id} - returns KpiResponse
export async function getKpiResults(taskId: string) {
  const response = await fetch(`http://your-backend/kpis/${taskId}`);
  return response.json();
}
```

## Data Model

See `src/types/kpi.types.ts` for full schema. Key structure:

```typescript
interface KpiResponse {
  month: string;
  total_units_sold: number;
  avg_gross_per_unit: number;
  fi_penetration_rate: number;
  lease_finance_cash_ratio: { lease, finance, cash };
  top_salespeople: [{ name, units, avg_gross }];
  units_by_vehicle_type: { SUV, Sedan, Truck };
  insights: string;
  // ... 10+ more KPIs
}
```

## Scripts

- `npm start` - Dev server (port 3000)
- `npm build` - Production build
- `npm test` - Run tests

## Design System

**Colors**: Dark blue/grey palette (#1e3a5f, #2c5282, #3b82f6)  
**Components**: Card-based layout, hover effects, smooth transitions  
**Charts**: Color-coded (blues, purples, greens, oranges)

## Future Enhancements

- Month-to-month comparison
- Export (JSON/CSV/PDF)
- Filters (salesperson, vehicle type)
- Historical trend graphs
- Authentication

## Notes

- Mock data in `src/mocks/kpiResponse.json`
- No routing library (simple view state in App.tsx)
- Ready for seamless backend integration - no refactor needed