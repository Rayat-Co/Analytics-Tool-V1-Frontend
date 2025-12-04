import React, { useState } from 'react';
import './UploadDealSummaryPage.css';

interface UploadDealSummaryPageProps {
  apiUrl: string;
  token: string;
  onNavigateToMasterSheet?: (sheet?: string) => void;
  onNavigateToDashboard?: () => void;
}

const UploadDealSummaryPage: React.FC<UploadDealSummaryPageProps> = ({ 
  apiUrl, 
  token, 
  onNavigateToMasterSheet,
  onNavigateToDashboard 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    setError(null);
    setUploadResult(null);

    // Validate file
    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'));

    if (!validExtensions.includes(fileExtension)) {
      setError('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${apiUrl}/api/deal-summary/process`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      const result = await response.json();
      setUploadResult(result);
      setFile(null);

      // Store the most recent deal info for highlighting
      if (result.success && result.newly_added_row_index !== null) {
        localStorage.setItem('latestDeal', JSON.stringify({
          month: result.month_sheet,
          rowIndex: result.newly_added_row_index,
          dealNumber: result.deal_number,
          timestamp: new Date().toISOString()
        }));
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setUploading(false);
    }
  };

  const handleViewMasterSheet = () => {
    if (onNavigateToMasterSheet) {
      onNavigateToMasterSheet(uploadResult.month_sheet);
    }
  };

  return (
    <div className="upload-deal-summary-page">
      <div className="page-header">
        <h1>📄 Upload Deal Summary</h1>
        <p>Upload deal summaries to automatically update the master salesbook</p>
      </div>

      <div className="upload-container">
        <div className="upload-card">
          <div
            className={`drop-zone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />

            {file ? (
              <div className="file-info">
                <div className="file-icon">📄</div>
                <div className="file-details">
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
            ) : (
              <div className="drop-zone-content">
                <div className="upload-icon">📤</div>
                <p className="drop-text">
                  <strong>Click to upload</strong> or drag and drop
                </p>
                <p className="drop-hint">Excel files only (.xlsx, .xls) • Max 50MB</p>
              </div>
            )}
          </div>

          {file && (
            <div className="upload-actions">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="upload-button"
              >
                {uploading ? (
                  <>
                    <span className="spinner-small"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    ✅ Process Deal Summary
                  </>
                )}
              </button>

              <button
                onClick={() => setFile(null)}
                disabled={uploading}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          )}

          {error && (
            <div className="error-alert">
              <span className="error-icon">❌</span>
              <span>{error}</span>
            </div>
          )}

          {uploadResult && (
            <div className="success-alert">
              <div className="success-content">
                <div className="success-header">
                  <span className="success-icon">✅</span>
                  <div className="success-title">Deal Processed Successfully!</div>
                </div>
                <div className="success-details">
                  <div className="detail-row">
                    <span className="detail-label">Deal Number:</span>
                    <span className="detail-value">{uploadResult.deal_number}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Appended to:</span>
                    <span className="detail-value">
                      {uploadResult.month_sheet} sheet
                      {uploadResult.newly_added_row_index !== null && 
                        ` (row ${uploadResult.newly_added_row_index + 1})`}
                    </span>
                  </div>
                  {uploadResult.kpis_updated && (
                    <div className="detail-row success">
                      <span className="detail-label">📊 KPIs:</span>
                      <span className="detail-value">Updated for {uploadResult.month_sheet}</span>
                    </div>
                  )}
                  {uploadResult.duplicate_warning && (
                    <div className="detail-row warning">
                      <span className="detail-label">⚠️ Warning:</span>
                      <span className="detail-value">This deal number already exists in the master sheet</span>
                    </div>
                  )}
                </div>
                <div className="success-actions">
                  <button onClick={handleViewMasterSheet} className="view-button">
                    👁️ View in Master Sheet
                  </button>
                  <button onClick={() => setUploadResult(null)} className="done-button">
                    Upload Another
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="instructions-card">
          <h3>📋 Instructions</h3>
          <ol>
            <li>Select or drag a deal summary Excel file (.xlsx or .xls)</li>
            <li>Click "Process Deal Summary" to extract and save the data</li>
            <li>The deal will be automatically added to the correct month in the master sheet</li>
            <li>A backup is created before each update</li>
          </ol>

          <div className="quick-links">
            <h4>Quick Links</h4>
            <button onClick={() => onNavigateToMasterSheet?.()} className="link-button">
              📊 View Master Sheet
            </button>
            <button onClick={onNavigateToDashboard} className="link-button">
              🏠 Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDealSummaryPage;

