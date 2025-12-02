import React from 'react';
import { useNavigate } from 'react-router-dom';
import BookingForm from './BookingForm';
import { Booking } from '../types/booking';
import * as BookingService from './BookingService';

const BookingCreatePage: React.FC = () => {
    const navigate = useNavigate(); // Create a navigate function

    const handleBookingCreated = async (booking: Booking) => {
        try {
            const data = await BookingService.createBooking(booking);
            console.log('Booking created successfully:', data);
            navigate('/bookings'); // Navigate back after successful creation
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    return (
        <div>
            <h2>Create New Booking</h2>
            <BookingForm onBookingChanged={handleBookingCreated} />
        </div>
    );
};

export default BookingCreatePage;