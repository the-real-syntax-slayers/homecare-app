// src/bookings/BookingListPage.tsx

import React from 'react';
import { Button } from 'react-bootstrap';
import { useAuth } from '../auth/AuthContext';
import MyBookingsPage from './MyBookingsPage';

const BookingListPage: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <div>
                <h1>Bookings</h1>
                <p>You must be logged in to create or view bookings.</p>
            </div>
        );
    }

    // Hvis ansatt: vis samme oversikt som "My bookings"
    if (user.role === 'Employee') {
        return <MyBookingsPage />;
    }

    // Pasient + Admin: kan opprette nye bookinger
    const canCreate = user.role === 'Patient' || user.role === 'Admin';

    return (
        <div>
            <h1>Bookings</h1>
            <p>
                Use this page to create a new booking. To see, update or cancel your
                existing bookings, go to <strong>My bookings</strong> in the menu.
            </p>

            {canCreate && (
                <Button
                    href="/bookingcreate"
                    className="btn btn-primary mt-3"
                >
                    Add New Booking
                </Button>
            )}
        </div>
    );
};

export default BookingListPage;
