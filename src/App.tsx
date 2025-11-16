import { useState } from 'react';
import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';
import './App.css';

type AppView = 'upload' | 'dashboard';

function App() {
    const [view, setView] = useState<AppView>('upload');
    const [taskId, setTaskId] = useState<string>('');

    const handleUploadComplete = (newTaskId: string) => {
        setTaskId(newTaskId);
        setView('dashboard');
    };

    const handleNewUpload = () => {
        setTaskId('');
        setView('upload');
    };

    return (
        <div className="App">
            {view === 'upload' && <Home onUploadComplete={handleUploadComplete} />}
            {view === 'dashboard' && taskId && (
                <DashboardPage taskId={taskId} onNewUpload={handleNewUpload} />
            )}
        </div>
    );
}

export default App;