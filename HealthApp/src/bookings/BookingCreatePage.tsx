import React from 'react';
import BookingForm from './BookingForm';
import * as BookingService from './BookingService';

const BookingCreatePage: React.FC = () => {
    const handleCreate = async (booking: any) => {
        await BookingService.createBooking(booking);
    };

    return (
        <div>
            <h1>Create booking</h1>
            <BookingForm onSubmit={handleCreate} />
        </div>
    );
};

export default BookingCreatePage;
