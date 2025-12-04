// HealthApp/src/availableDays/AvailableDayGetAll.tsx
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import AvailableDayTable from './AvailableDayTable';
import { AvailableDay } from '../types/availableDay';
import * as AvailableDayService from './AvailableDayService';
import { useAuth } from '../auth/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const AvailableDayGetAll: React.FC = () => {
    const [availableDays, setAvailableDays] = useState<AvailableDay[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    // 1. Get User
    const { user } = useAuth();

    const fetchAvailableDays = async () => {
        setLoading(true);
        setError(null);

        try {
            let data: AvailableDay[] = await AvailableDayService.fetchAvailableDays();
            
            // 2. Filter for Employees
            if (user?.role === 'Employee' && user.employeeId) {
                data = data.filter(day => day.employeeId === user.employeeId);
            }
            // If patient, they shouldn't be here (handled in App.tsx), but we filter just in case.
            if (user?.role === 'Patient') {
                data = [];
            }

            setAvailableDays(data);
        } catch (error) {
            console.error('Error fetching days', error);
            setError('Failed to fetch availableDays.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAvailableDays();
    }, [user]);

    const handleAvailableDayDeleted = async (availableDayId: number) => {
        if (window.confirm(`Delete day ${availableDayId}?`)) {
            try {
                await AvailableDayService.deleteAvailableDay(availableDayId);
                setAvailableDays(prev => prev.filter(d => d.availableDayId !== availableDayId));
            } catch (error) {
                setError('Failed to delete availableDay.');
            }
        }
    };

    return (
        <div className="container p-0">
            <h1>AvailableDays</h1>
            <Button onClick={fetchAvailableDays} className="btn btn-primary mb-3 me-2" disabled={loading}>
                {loading ? 'Loading...' : 'Refresh'}
            </Button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <AvailableDayTable availableDays={availableDays} apiUrl={API_URL} onAvailableDayDeleted={handleAvailableDayDeleted} />
            
            {user && (
                <Button href='/availableDayscreate' className='btn btn-secondary mt-3'>Add New AvailableDay</Button>
            )}
        </div>
    );
};

export default AvailableDayGetAll;