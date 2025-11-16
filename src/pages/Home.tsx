import React from 'react';
import UploadSpreadsheet from '../components/UploadSpreadsheet';

interface HomeProps {
    onUploadComplete: (taskId: string) => void;
}

const Home: React.FC<HomeProps> = ({ onUploadComplete }) => {
    return (
        <div>
            <UploadSpreadsheet onUploadComplete={onUploadComplete} />
        </div>
    );
};

export default Home;