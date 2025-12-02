import React from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const HomePage: React.FC = () => {
    return (
        <div className="text-center">
            <h1 className="display-4">Welcome to Health App</h1>
        </div>
    );
};

export default HomePage;