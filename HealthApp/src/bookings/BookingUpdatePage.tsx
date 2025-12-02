import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BookingForm from './BookingForm';
import { Booking } from '../types/booking';
import * as BookingService from './BookingService';

const BookingUpdatePage: React.FC = () => {
    const { bookingId } = useParams<{ bookingId: string }>(); // Get bookingId from the URL
    const navigate = useNavigate(); // Create a navigate function
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const data = await BookingService.fetchBookingById(bookingId!);
                setBooking(data);
            } catch (error) {
                setError('Failed to fetch booking');
                console.error('There was a problem with the fetch operation:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId]);

    const handleBookingUpdated = async (booking: Booking) => {

        try {
            const data = await BookingService.updateBooking(Number(bookingId), booking);
            console.log('Booking updated successfully:', data);
            navigate('/bookings'); // Navigate back after successful creation
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!booking) return <p>No booking found</p>;

    return (
        <div>
            <h2>Update Booking</h2>
            <BookingForm onBookingChanged={handleBookingUpdated} bookingId={booking.bookingId} isUpdate={true} initialData={booking} />
        </div>
    );
};

export default BookingUpdatePage;