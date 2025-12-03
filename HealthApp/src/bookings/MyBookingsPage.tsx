import React, { useEffect, useState } from 'react';
import { Booking } from '../types/booking';
import * as BookingService from './BookingService';
import { useAuth } from '../auth/AuthContext';
import { Button, Table } from 'react-bootstrap';

const MyBookingsPage: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);

    const load = async () => {
        const all = await BookingService.fetchBookings();

        let mine: Booking[] = [];

        if (!user) {
            mine = [];
        } else if (user.role === 'Admin') {
            // Admin ser alt
            mine = all;
        } else if (user.role === 'Employee' && user.employeeId) {
            // Ansatt ser bookinger på seg selv
            mine = all.filter(b => b.employeeId === user.employeeId);
        } else if (user.role === 'Patient' && user.patientId) {
            // Pasient ser bare sine bookinger
            mine = all.filter(b => b.patientId === user.patientId);
        }

        setBookings(mine);
    };

    const cancelBooking = async (id: number) => {
        const confirmDelete = window.confirm('Cancel this booking?');
        if (!confirmDelete) return;

        await BookingService.deleteBooking(id);
        await load();
    };

    useEffect(() => {
        if (user) load();
    }, [user]);

    if (!user) return <p>You must be logged in.</p>;

    return (
        <div>
            <h1>My bookings</h1>

            {bookings.length === 0 && <p>You have no bookings.</p>}

            {bookings.length > 0 && (
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Employee</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(b => (
                            <tr key={b.bookingId}>
                                <td>{new Date(b.date).toLocaleString()}</td>
                                <td>{b.description}</td>
                                <td>{b.employeeId}</td>
                                <td>
                                    <Button
                                        variant="danger"
                                        onClick={() => cancelBooking(b.bookingId!)}
                                    >
                                        Cancel
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default MyBookingsPage;
