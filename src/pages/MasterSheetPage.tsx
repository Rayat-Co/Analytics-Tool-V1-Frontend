import React from 'react';
import MasterSheetViewer from '../components/MasterSheet/MasterSheetViewer';
import './MasterSheetPage.css';

interface MasterSheetPageProps {
  apiUrl: string;
  token: string;
  onNavigateToUpload?: () => void;
  onNavigateToDashboard?: () => void;
}

const MasterSheetPage: React.FC<MasterSheetPageProps> = ({ 
  apiUrl, 
  token,
  onNavigateToUpload,
  onNavigateToDashboard 
}) => {

  return (
    <div className="master-sheet-page">
      <div className="page-header">
        <div className="header-left">
          <h1>📊 Master Salesbook</h1>
          <p>View and manage all deal records</p>
        </div>
        <div className="header-right">
          <button onClick={onNavigateToUpload} className="upload-nav-button">
            📤 Upload Deal Summary
          </button>
          <button onClick={onNavigateToDashboard} className="home-button">
            🏠 Dashboard
          </button>
        </div>
      </div>

      <div className="master-sheet-container">
        <MasterSheetViewer apiUrl={apiUrl} token={token} />
      </div>
    </div>
  );
};

export default MasterSheetPage;

