import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface TemporaryPageProps {
    pageName: string;
}

const TemporaryPage: React.FC<TemporaryPageProps> = ({ pageName }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    {pageName} Page
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    This page is being migrated to the new API structure.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Redirecting to home in 3 seconds...
                </p>
                <button 
                    onClick={() => navigate('/')}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Go to Home Now
                </button>
            </div>
        </div>
    );
};

export default TemporaryPage;
