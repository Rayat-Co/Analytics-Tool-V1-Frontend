import { useState, useEffect } from 'react';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import LoginPage from './pages/LoginPage';
import UploadDealSummaryPage from './pages/UploadDealSummaryPage';
import MasterSheetPage from './pages/MasterSheetPage';
import { isAuthenticated } from './api/api';
import './App.css';

type View = 'dashboard' | 'upload-deal' | 'master-sheet';

function App() {
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentView, setCurrentView] = useState<View>('dashboard');

    useEffect(() => {
        // Check if user is already authenticated
        setAuthenticated(isAuthenticated());
        setLoading(false);
    }, []);

    const handleLoginSuccess = (token: string, username: string) => {
        setAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('username');
        setAuthenticated(false);
        setCurrentView('dashboard');
    };

    if (loading) {
        return (
            <div className="App">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    const token = localStorage.getItem('auth_token') || '';
    const apiUrl = 'http://localhost:8000';

    return (
        <div className="App">
            {authenticated ? (
                <>
                    {currentView === 'dashboard' && (
                        <DashboardPage 
                            onLogout={handleLogout} 
                            onNavigateToUploadDeal={() => setCurrentView('upload-deal')}
                            onNavigateToMasterSheet={() => setCurrentView('master-sheet')}
                        />
                    )}
                    {currentView === 'upload-deal' && (
                        <UploadDealSummaryPage 
                            apiUrl={apiUrl}
                            token={token}
                            onNavigateToMasterSheet={() => setCurrentView('master-sheet')}
                            onNavigateToDashboard={() => setCurrentView('dashboard')}
                        />
                    )}
                    {currentView === 'master-sheet' && (
                        <MasterSheetPage 
                            apiUrl={apiUrl}
                            token={token}
                            onNavigateToUpload={() => setCurrentView('upload-deal')}
                            onNavigateToDashboard={() => setCurrentView('dashboard')}
                        />
                    )}
                </>
            ) : (
                <LoginPage onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
}

export default App;