import React, { useState, useRef } from 'react';
import './UploadSpreadsheet.css';

interface UploadSpreadsheetProps {
    onUploadComplete: (taskId: string) => void;
}

const UploadSpreadsheet: React.FC<UploadSpreadsheetProps> = ({ onUploadComplete }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string>('');
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): boolean => {
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/vnd.ms-excel', // .xls
            'text/csv' // .csv
        ];

        const validExtensions = ['.xlsx', '.xls', '.csv'];
        const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));

        if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
            setError('Please upload a valid Excel (.xlsx, .xls) or CSV file');
            return false;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            setError('File size must be less than 10MB');
            return false;
        }

        return true;
    };

    const handleFile = (selectedFile: File) => {
        setError('');
        if (validateFile(selectedFile)) {
            setFile(selectedFile);
        }
    };

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setProgress(0);
        setError('');

        try {
            // Simulate upload with progress
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 100);

            // Mock API call - simulate 1 second upload
            await new Promise(resolve => setTimeout(resolve, 1000));

            clearInterval(interval);
            setProgress(100);

            // Mock task ID response
            const taskId = 'mock123';

            setTimeout(() => {
                onUploadComplete(taskId);
            }, 500);

        } catch (err) {
            setError('Upload failed. Please try again.');
            setUploading(false);
            setProgress(0);
        }
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const handleReset = () => {
        setFile(null);
        setProgress(0);
        setError('');
        setUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="upload-container">
            <div className="upload-card">
                <h2>Upload Dealership Spreadsheet</h2>
                <p className="upload-description">
                    Upload your monthly sales data in Excel or CSV format
                </p>

                <div
                    className={`drop-zone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {!file ? (
                        <>
                            <div className="upload-icon">📊</div>
                            <p className="drop-text">Drag and drop your file here</p>
                            <p className="drop-subtext">or</p>
                            <button className="browse-button" onClick={handleBrowseClick}>
                                Browse Files
                            </button>
                            <p className="file-types">Supported: .xlsx, .xls, .csv (Max 10MB)</p>
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
                            {!uploading && (
                                <button className="remove-file" onClick={handleReset}>
                                    ✕
                                </button>
                            )}
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleChange}
                        style={{ display: 'none' }}
                    />
                </div>

                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}

                {uploading && (
                    <div className="progress-container">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="progress-text">{progress}% Uploaded</p>
                    </div>
                )}

                {file && !uploading && (
                    <button
                        className="upload-button"
                        onClick={handleUpload}
                    >
                        Analyze Spreadsheet
                    </button>
                )}
            </div>
        </div>
    );
};

export default UploadSpreadsheet;