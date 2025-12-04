import React, { useState } from 'react';
import MasterSheetViewer from '../components/MasterSheet/MasterSheetViewer';
import './DealProcessingPage.css';

interface DealProcessingPageProps {
  apiUrl: string;
  token: string;
}

const DealProcessingPage: React.FC<DealProcessingPageProps> = ({ apiUrl, token }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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

      // Trigger refresh of master sheet viewer
      setTimeout(() => {
        setRefreshKey(prev => prev + 1);
      }, 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="deal-processing-page">
      <div className="page-header">
        <h1>📄 Deal Summary Processing</h1>
        <p>Upload deal summaries to automatically update the master salesbook</p>
      </div>

      <div className="upload-section">
        <div className="upload-card">
          <h3>Upload Deal Summary</h3>

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
                <p className="drop-hint">Excel files only (.xlsx, .xls)</p>
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
              <span className="success-icon">✅</span>
              <div className="success-details">
                <div className="success-title">{uploadResult.message}</div>
                <div className="success-info">
                  <span>Deal: {uploadResult.deal_number}</span>
                  <span>•</span>
                  <span>Month: {uploadResult.month_sheet}</span>
                  {uploadResult.duplicate_warning && (
                    <>
                      <span>•</span>
                      <span className="warning-text">⚠️ Duplicate detected</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="master-sheet-section">
        <MasterSheetViewer key={refreshKey} apiUrl={apiUrl} token={token} />
      </div>
    </div>
  );
};

export default DealProcessingPage;

