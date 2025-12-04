import React, { useState, useRef, useEffect } from 'react';
import { uploadFileToS3, checkS3Status } from '../api/api';
import './UploadPage.css';

interface UploadPageProps {
    onLogout: () => void;
    onNavigateToDashboard: () => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onLogout, onNavigateToDashboard }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [s3Status, setS3Status] = useState<{ configured: boolean; message: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Check S3 status on mount
        const checkStatus = async () => {
            try {
                const status = await checkS3Status();
                setS3Status(status);
            } catch (err) {
                console.error('Failed to check S3 status:', err);
            }
        };
        checkStatus();
    }, []);

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
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (selectedFile: File) => {
        // Validate file type
        const fileName = selectedFile.name.toLowerCase();
        if (!fileName.endsWith('.csv') && !fileName.endsWith('.xlsx')) {
            setUploadError('Only CSV and XLSX files are allowed');
            return;
        }

        // Validate file size (50MB max)
        const maxSize = 50 * 1024 * 1024;
        if (selectedFile.size > maxSize) {
            setUploadError('File size exceeds 50MB limit');
            return;
        }

        setFile(selectedFile);
        setUploadError(null);
        setUploadSuccess(null);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setUploadError(null);
        setUploadSuccess(null);

        try {
            const response = await uploadFileToS3(file);
            setUploadSuccess(response.message);
            setFile(null);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err: any) {
            setUploadError(err.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleClearFile = () => {
        setFile(null);
        setUploadError(null);
        setUploadSuccess(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="upload-page">
            <header className="upload-navbar">
                <h1 className="navbar-title">Ford Dealership Analytics - Upload</h1>
                <div className="navbar-buttons">
                    <button className="dashboard-btn" onClick={onNavigateToDashboard}>
                        📊 Dashboard
                    </button>
                    <button className="logout-btn" onClick={onLogout}>
                        🚪 Logout
                    </button>
                </div>
            </header>

            <div className="upload-container">
                <div className="upload-card">
                    <div className="upload-header">
                        <h2 className="upload-title">Upload Files to S3</h2>
                        <p className="upload-subtitle">
                            Securely upload your dealership data files (CSV or XLSX)
                        </p>
                    </div>

                    {/* S3 Status Indicator */}
                    {s3Status && (
                        <div className={`s3-status ${s3Status.configured ? 'configured' : 'not-configured'}`}>
                            <span className="status-icon">
                                {s3Status.configured ? '✅' : '⚠️'}
                            </span>
                            <span className="status-message">{s3Status.message}</span>
                        </div>
                    )}

                    {/* Upload Area */}
                    <div
                        className={`upload-dropzone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,.xlsx"
                            onChange={handleFileInputChange}
                            style={{ display: 'none' }}
                        />

                        {!file ? (
                            <>
                                <div className="upload-icon">📁</div>
                                <p className="upload-text">
                                    Drag and drop your file here
                                </p>
                                <p className="upload-subtext">or click to browse</p>
                                <p className="upload-limits">
                                    Maximum file size: 50MB | Accepted formats: CSV, XLSX
                                </p>
                            </>
                        ) : (
                            <div className="file-info">
                                <div className="file-icon">📄</div>
                                <div className="file-details">
                                    <p className="file-name">{file.name}</p>
                                    <p className="file-size">
                                        {(file.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                                <button
                                    className="clear-file-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClearFile();
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Success Message */}
                    {uploadSuccess && (
                        <div className="upload-message success">
                            <span className="message-icon">✅</span>
                            <span>{uploadSuccess}</span>
                        </div>
                    )}

                    {/* Error Message */}
                    {uploadError && (
                        <div className="upload-message error">
                            <span className="message-icon">❌</span>
                            <span>{uploadError}</span>
                        </div>
                    )}

                    {/* Upload Button */}
                    <button
                        className="upload-submit-btn"
                        onClick={handleUpload}
                        disabled={!file || uploading || !s3Status?.configured}
                    >
                        {uploading ? (
                            <>
                                <span className="spinner"></span>
                                Uploading...
                            </>
                        ) : (
                            <>
                                <span>🚀</span>
                                Upload to S3
                            </>
                        )}
                    </button>

                    {/* Security Notice */}
                    <div className="security-notice">
                        <div className="security-icon">🔒</div>
                        <div className="security-text">
                            <strong>Secure Upload</strong>
                            <p>All uploads are encrypted and require authentication</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadPage;

