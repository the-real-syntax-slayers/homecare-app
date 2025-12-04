// HealthApp/src/bookings/BookingGetAll.tsx
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import BookingCalendar from './BookingCalendar';
import BookingTable from './BookingTable';
import { Booking } from '../types/booking';
import * as BookingService from './BookingService';
import { useAuth } from '../auth/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const BookingGetAll: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showTable, setShowTable] = useState<boolean>(true);
    
    // 1. Get the current user from your AuthContext
    const { user } = useAuth();

    const toggleCalendarOrTable = () => setShowTable(prevShowTable => !prevShowTable);

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);

        try {
            // 2. Fetch all bookings
            let data: Booking[] = await BookingService.fetchBookings();

            // 3. Filter based on Role and ID (Frontend Filtering)
            if (user) {
                if (user.role === 'Patient' && user.patientId) {
                    data = data.filter(b => b.patientId === user.patientId);
                } else if (user.role === 'Employee' && user.employeeId) {
                    data = data.filter(b => b.employeeId === user.employeeId);
                }
                // Admin sees everything (no filter)
            } else {
                // Not logged in? See nothing.
                data = [];
            }

            setBookings(data);
            console.log(data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
            }
            setError('Failed to fetch bookings.');
        } finally {
            setLoading(false);
        }
    };

    // Re-fetch if the user changes (e.g. login/logout)
    useEffect(() => {
        fetchBookings();
    }, [user]);

    const handleBookingDeleted = async (bookingId: number) => {
        const confirmDelete = window.confirm(`Delete booking ${bookingId}?`);
        if (confirmDelete) {
            try {
                await BookingService.deleteBooking(bookingId);
                setBookings(prev => prev.filter(b => b.bookingId !== bookingId));
            } catch (error) {
                setError('Failed to delete booking.');
            }
        }
    };

    return (
        <div>
            <h1>Bookings</h1>
            <Button onClick={fetchBookings} className="btn btn-primary mb-3 me-2" disabled={loading}>
                {loading ? 'Loading...' : 'Refresh'}
            </Button>
            <Button onClick={toggleCalendarOrTable} className='btn btn-primary mb-3 me-2'>
                {showTable ? `Display Calendar` : `Display Table`}
            </Button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {/* 4. Pass the FILTERED bookings to both components */}
            {showTable
                ? <BookingTable bookings={bookings} apiUrl={API_URL} onBookingDeleted={handleBookingDeleted} />
                : <BookingCalendar bookings={bookings} apiUrl={API_URL} onBookingDeleted={handleBookingDeleted} />}
            
            {user && (
                <Button href='/bookingcreate' className='btn btn-secondary mt-3'>Add New Booking</Button>
            )}
        </div>
    );
};

export default BookingGetAll;