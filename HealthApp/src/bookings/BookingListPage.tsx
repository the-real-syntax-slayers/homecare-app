import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import BookingCalendar from './BookingCalendar';
import BookingTable from './BookingTable';
import { Booking } from '../types/booking';
import * as BookingService from './BookingService';
import { useAuth } from '../auth/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const BookingListPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showTable, setShowTable] = useState<boolean>(true);
    const { user } = useAuth();

    const canEdit = !!user;

    const toggleCalendarOrTable = () => setShowTable(prevShowTable => !prevShowTable);

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await BookingService.fetchBookings();

            let filtered: Booking[] = [];

            if (!user) {
                // ikke innlogget: kanskje se ingenting, eller alt – velg selv
                filtered = data;
            } else if (user.role === 'Admin') {
                filtered = data;
            } else if (user.role === 'Employee' && user.employeeId) {
                filtered = data.filter(b => b.employeeId === user.employeeId);
            } else if (user.role === 'Patient' && user.patientId) {
                filtered = data.filter(b => b.patientId === user.patientId);
            } else {
                filtered = [];
            }

            setBookings(filtered);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`There was a problem with the fetch operation: ${error.message}`);
            } else {
                console.error('Unknown error', error);
            }
            setError('Failed to fetch bookings.');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchBookings();
    }, []);

    const handleBookingDeleted = async (bookingId: number) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the booking ${bookingId}?`);
        if (confirmDelete) {
            try {
                await BookingService.deleteBooking(bookingId);
                setBookings(prevBookings =>
                    prevBookings.filter(booking => booking.bookingId !== bookingId)
                );
                console.log('Booking deleted:', bookingId);
            } catch (error) {
                console.error('Error deleting booking:', error);
                setError('Failed to delete booking.');
            }
        }
    };

    return (
        <div>
            <h1>Bookings</h1>
            <Button onClick={fetchBookings} className="btn btn-primary mb-3 me-2" disabled={loading}>
                {loading ? 'Loading...' : 'Refresh Bookings'}
            </Button>
            <Button onClick={toggleCalendarOrTable} className='btn btn-primary mb-3 me-2'>
                {showTable ? `Display Table` : `Display Calendar`}
            </Button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {showTable
                ? <BookingCalendar bookings={bookings} apiUrl={API_URL} onBookingDeleted={handleBookingDeleted} />
                : <BookingTable bookings={bookings} apiUrl={API_URL} onBookingDeleted={handleBookingDeleted} />}

            {canEdit && (
                <Button href='/bookingcreate' className='btn btn-secondary mt-3'>
                    Add New Booking
                </Button>
            )}
        </div>
    );
};

export default BookingListPage;
