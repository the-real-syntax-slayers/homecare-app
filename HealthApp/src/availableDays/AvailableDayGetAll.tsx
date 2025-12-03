import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import AvailableDayCalendar from './AvailableDayCalendar';
import AvailableDayTable from './AvailableDayTable';
import { AvailableDay } from '../types/availableDay';
import * as AvailableDayService from './AvailableDayService';
import { useAuth } from '../auth/AuthContext';
const API_URL = import.meta.env.VITE_API_URL;

const AvailableDayGetAll: React.FC = () => {
    const [availableDays, setAvailableDays] = useState<AvailableDay[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showTable, setShowTable] = useState<boolean>(true);
    const { user } = useAuth();

    const toggleCalendarOrTable = () => setShowTable(prevShowTable => !prevShowTable);

    const fetchAvailableDays = async () => {
        setLoading(true); // Set loading to true when starting the fetch
        setError(null); // Clear any previous errors

        try {
            const data = await AvailableDayService.fetchAvailableDays();
            setAvailableDays(data);
            console.log(data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`There was a problem with the fetch operation: ${error.message}`);
            } else {
                console.error('Unknown error', error);
            }
            setError('Failed to fetch availableDay.');
        } finally {
            setLoading(false); // Set loading to false once the fetch is complete
        }
    };

    useEffect(() => {
        fetchAvailableDays();
    }, []);

    // noe vi må se på, availableDay fucka seg når jeg prøvde denna.

    /* useEffect(() => {
        // Use localStorage.getItem / setItem if you want to persist the view mode
        const savedViewMode = localStorage.getItem('availableDayViewMode');
        console.log('[fetch availableDay] Saved view mode:', savedViewMode); // Debugging line
        if (savedViewMode) {
            if (savedViewMode === 'calendar')
                setShowTable(false)
            console.log('show table', showTable);
        }
        fetchAvailableDay();
    }, []);

    useEffect(() => {
        console.log('[save view state] Saving view mode:', showTable ? 'table' : 'calendar');
        localStorage.setItem('availableDayViewMode', showTable ? 'table' : 'calendar');
    }, [showTable]);*/

    const handleAvailableDayDeleted = async (availableDayId: number) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the availableDay ${availableDayId}?`);
        if (confirmDelete) {
            try {
                await AvailableDayService.deleteAvailableDay(availableDayId);
                setAvailableDays(prevAvailableDays => prevAvailableDays.filter(availableDay => availableDay.availableDayId !== availableDayId));
                console.log('AvailableDay deleted:', availableDayId);
            } catch (error) {
                console.error('Error deleting availableDay:', error);
                setError('Failed to delete availableDay.');
            }
        }
    };

    return (
        <div>
            <h1>AvailableDays</h1>
            <Button onClick={fetchAvailableDays} className="btn btn-primary mb-3 me-2" disabled={loading}>
                {loading ? 'Loading...' : 'Refresh AvailableDays'}
            </Button>
            <Button onClick={toggleCalendarOrTable} className='btn btn-primary mb-3 me-2'>
                {showTable ? `Display Table` : `Display Calendar`}
            </Button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {showTable
                ? <AvailableDayCalendar availableDays={availableDays} apiUrl={API_URL} onAvailableDayDeleted={handleAvailableDayDeleted} />
                : <AvailableDayTable availableDays={availableDays} apiUrl={API_URL} onAvailableDayDeleted={handleAvailableDayDeleted} />}
            {user && (
                <Button href='/availableDayscreate' className='btn btn-secondary mt-3'>Add New AvailableDay</Button>
            )}

        </div>
    );
};

export default AvailableDayGetAll;