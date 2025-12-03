import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BookingForm from './BookingForm';
import { Booking } from '../types/booking';
import * as BookingService from './BookingService';

const BookingUpdatePage: React.FC = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            if (!bookingId) {
                setError('No booking id provided');
                setLoading(false);
                return;
            }

            try {
                const data = await BookingService.fetchBookingById(Number(bookingId));
                setBooking(data);
            } catch (err) {
                console.error('Error loading booking', err);
                setError('Failed to load booking.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [bookingId]);

    const handleUpdate = async (updated: Booking) => {
        if (!bookingId) return;
        await BookingService.updateBooking(Number(bookingId), updated);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!booking) return <p>Booking not found.</p>;

    return (
        <div>
            <h1>Update booking</h1>
            <BookingForm initialData={booking} onSubmit={handleUpdate} />
        </div>
    );
};

export default BookingUpdatePage;
