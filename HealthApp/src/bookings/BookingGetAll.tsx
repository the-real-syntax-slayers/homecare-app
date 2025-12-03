import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
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
    const { user } = useAuth();

    const toggleCalendarOrTable = () => setShowTable(prevShowTable => !prevShowTable);

    const fetchBookings = async () => {
        setLoading(true); // Set loading to true when starting the fetch
        setError(null); // Clear any previous errors

        try {
            const data = await BookingService.fetchBookings();
            setBookings(data);
            console.log(data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`There was a problem with the fetch operation: ${error.message}`);
            } else {
                console.error('Unknown error', error);
            }
            setError('Failed to fetch bookings.');
        } finally {
            setLoading(false); // Set loading to false once the fetch is complete
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // noe vi må se på, bookings fucka seg når jeg prøvde denna.

    /* useEffect(() => {
        // Use localStorage.getItem / setItem if you want to persist the view mode
        const savedViewMode = localStorage.getItem('bookingViewMode');
        console.log('[fetch bookings] Saved view mode:', savedViewMode); // Debugging line
        if (savedViewMode) {
            if (savedViewMode === 'calendar')
                setShowTable(false)
            console.log('show table', showTable);
        }
        fetchBookings();
    }, []);

    useEffect(() => {
        console.log('[save view state] Saving view mode:', showTable ? 'table' : 'calendar');
        localStorage.setItem('bookingViewMode', showTable ? 'table' : 'calendar');
    }, [showTable]);*/

    const handleBookingDeleted = async (bookingId: number) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the booking ${bookingId}?`);
        if (confirmDelete) {
            try {
                await BookingService.deleteBooking(bookingId);
                setBookings(prevBookings => prevBookings.filter(booking => booking.bookingId !== bookingId));
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
                {loading ? 'Loading...' : 'Refresh All Bookings'}
            </Button>
            <Button onClick={toggleCalendarOrTable} className='btn btn-primary mb-3 me-2'>
                {showTable ? `Display Table` : `Display Calendar`}
            </Button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {showTable
                ? <BookingCalendar bookings={bookings} apiUrl={API_URL} onBookingDeleted={handleBookingDeleted} />
                : <BookingTable bookings={bookings} apiUrl={API_URL} onBookingDeleted={handleBookingDeleted} />}
            {user && (
                <Button href='/bookingcreate' className='btn btn-secondary mt-3'>Add New Booking</Button>
            )}

        </div>
    );
};

export default BookingGetAll;