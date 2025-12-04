import React, { useState, useEffect } from 'react';
import './MasterSheetViewer.css';

interface MasterSheetData {
  sheet_name: string | null;
  columns: string[];
  rows: Record<string, any>[];
  total_rows: number;
  summary: {
    total_rows: number;
    unique_deals: number;
    current_sheet: string;
    location: string;
    bucket: string;
    s3_key: string;
  };
  newly_added_rows: number[];
}

interface MasterSheetViewerProps {
  apiUrl: string;
  token: string;
}

const MasterSheetViewer: React.FC<MasterSheetViewerProps> = ({ apiUrl, token }) => {
  const [data, setData] = useState<MasterSheetData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<string>('Nov');
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [latestDealRow, setLatestDealRow] = useState<{month: string; rowIndex: number; dealNumber: string} | null>(null);

  // Fetch available sheets
  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/master-sheet/sheets`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch sheets');
        }

        const result = await response.json();
        setAvailableSheets(result.monthly_sheets);
      } catch (err) {
        console.error('Error fetching sheets:', err);
      }
    };

    fetchSheets();
  }, [apiUrl, token]);

  // Fetch sheet data
  const fetchSheetData = async (sheetName: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${apiUrl}/api/master-sheet/data?sheet=${sheetName}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch master sheet data');
      }

      const result: MasterSheetData = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch download URL
  const fetchDownloadUrl = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/master-sheet/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate download URL');
      }

      const result = await response.json();
      setDownloadUrl(result.download_url);

      // Open download in new tab
      window.open(result.download_url, '_blank');
    } catch (err) {
      console.error('Error downloading:', err);
      alert('Failed to generate download link');
    }
  };

  // Load latest deal info from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('latestDeal');
      if (stored) {
        setLatestDealRow(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Error loading latest deal:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (selectedSheet) {
      fetchSheetData(selectedSheet);
    }
  }, [selectedSheet]);

  const handleSheetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSheet(e.target.value);
  };

  const handleRefresh = () => {
    if (selectedSheet) {
      fetchSheetData(selectedSheet);
    }
  };

  return (
    <div className="master-sheet-viewer">
      <div className="viewer-header">
        <div className="header-left">
          <h2>📊 Master Salesbook</h2>
          {data && (
            <div className="sheet-info">
              <span className="info-badge">
                {data.summary.current_sheet} Sheet
              </span>
              <span className="info-badge">
                {data.total_rows} deals
              </span>
              <span className="info-badge">
                📍 {data.summary.location}
              </span>
            </div>
          )}
        </div>

        <div className="header-right">
          <div className="sheet-selector">
            <label htmlFor="sheet-select">Month:</label>
            <select
              id="sheet-select"
              value={selectedSheet}
              onChange={handleSheetChange}
              className="sheet-select"
            >
              {availableSheets.map((sheet) => (
                <option key={sheet} value={sheet}>
                  {sheet}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRefresh}
            className="refresh-button"
            disabled={loading}
          >
            🔄 Refresh
          </button>

          <button
            onClick={fetchDownloadUrl}
            className="download-button"
          >
            📥 Download Excel
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading sheet data from S3...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <p className="error-message">❌ {error}</p>
          <button onClick={handleRefresh} className="retry-button">
            Try Again
          </button>
        </div>
      )}

      {data && !loading && !error && (
        <div className="sheet-container">
          <div className="table-wrapper">
            <table className="master-sheet-table">
              <thead>
                <tr>
                  <th className="row-number-header">#</th>
                  {data.columns.map((col, idx) => (
                    <th key={idx} title={col}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row, rowIdx) => {
                  // Check if this is the most recently added row
                  const isLatestDeal = latestDealRow && 
                    latestDealRow.month === data.sheet_name && 
                    latestDealRow.rowIndex === rowIdx;
                  
                  const rowClass = isLatestDeal 
                    ? 'newly-added-row' 
                    : (rowIdx % 2 === 0 ? 'even-row' : 'odd-row');
                  
                  return (
                    <tr key={rowIdx} className={rowClass}>
                      <td className="row-number">
                        {isLatestDeal && <span className="new-badge" title={`Latest: Deal ${latestDealRow.dealNumber}`}>●</span>}
                        {rowIdx + 1}
                      </td>
                      {data.columns.map((col, colIdx) => (
                        <td key={colIdx} title={String(row[col] || '')}>
                          {formatCellValue(row[col])}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="sheet-footer">
            <div className="footer-stats">
              <span>Total Deals: {data.total_rows}</span>
              <span>•</span>
              <span>Unique: {data.summary.unique_deals}</span>
              <span>•</span>
              <span>Columns: {data.columns.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to format cell values
const formatCellValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'number') {
    // Format numbers with commas
    if (Number.isInteger(value)) {
      return value.toLocaleString();
    }
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  return String(value);
};

export default MasterSheetViewer;

