// src/bookings/MyBookingsPage.tsx
import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Booking } from '../types/booking';
import * as BookingService from './BookingService';
import { useAuth } from '../auth/AuthContext';

const MyBookingsPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
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

    useEffect(() => {
        if (user) {
            load();
        }
    }, [user]);

    const cancelBooking = async (id: number) => {
        if (!window.confirm('Cancel this booking?')) return;
        await BookingService.deleteBooking(id);
        await load();
    };

    const goToUpdate = (id: number) => {
        navigate(`/bookingupdate/${id}`);
    };

    if (!user) return <p>You must be logged in.</p>;

    // Hvem skal se hva?
    const showEmployeeCol = user.role !== 'Employee'; // pasient + admin
    const showPatientCol = user.role !== 'Patient';   // ansatt + admin

    const formatDate = (value: string) => {
        if (!value) return '';
        const d = new Date(value);
        if (isNaN(d.getTime())) return value;
        return d.toLocaleString();
    };

    return (
        <div>
            <h1>My bookings</h1>

            <Button className="mb-3" onClick={load}>
                Refresh bookings
            </Button>

            {bookings.length === 0 && <p>You have no bookings.</p>}

            {bookings.length > 0 && (
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            {showEmployeeCol && <th>Employee</th>}
                            {showPatientCol && <th>Patient</th>}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(b => (
                            <tr key={b.bookingId}>
                                <td>{formatDate(b.date)}</td>
                                <td>{b.description}</td>
                                {showEmployeeCol && <td>{b.employeeId}</td>}
                                {showPatientCol && <td>{b.patientId}</td>}
                                <td>
                                    <Button
                                        variant="link"
                                        className="p-0 me-2"
                                        onClick={() => goToUpdate(b.bookingId!)}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
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
