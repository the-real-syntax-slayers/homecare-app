import React from 'react';
import { Table } from 'react-bootstrap';
import { Booking } from '../types/booking';
import * as BookingService from './BookingService';
import { useAuth } from '../auth/AuthContext';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface BookingTableProps {
    bookings: Booking[];
    apiUrl: string;
    onBookingDeleted?: (bookingId: number) => void;
}

const BookingTable: React.FC<BookingTableProps> = ({ apiUrl, onBookingDeleted }) => {


    const { user } = useAuth();
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);

    const load = async () => {
        const all = await BookingService.fetchBookings();

        let mine: Booking[] = [];

        // gjør at emp1 ikke ser emp 2
        if (!user) {
            mine = [];
        } else if (user.role === 'Admin') {
            // Admin ser alt
            mine = all;
        } else if (user.role === 'Employee' && user.employeeId) {
            // Ansatt ser bookinger på seg selv
            mine = all.filter(b => b.employeeId === user.employeeId!);
        } else if (user.role === 'Patient' && user.patientId) {
            // Pasient ser bare sine bookinger
            mine = all.filter(b => b.patientId === user.patientId!);
        }
        
        setFilteredBookings(mine);
    };

    useEffect(() => {
        if (user) {
            load();
        } else {
            setFilteredBookings([]);
        }
    }, [user]); // Add load to dependencies or use useCallback

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>BookingId</th>
                    <th>Descriptions</th>
                    <th>Date</th>
                    <th>PatientId</th>
                    <th>EmployeeId</th>
                    <th>availabledayId</th>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {filteredBookings.map(booking => (
                        <tr key={booking.bookingId}>
                        <td>{booking.bookingId}</td>
                        <td>{booking.description}</td>
                        <td>{new Date(booking.date).toLocaleString()}</td>
                        <td>{booking.patientId}</td>
                        <td>{booking.employeeId}</td>
                        <td>{booking.availableDayId}</td>
                        <td className='text-center'>
                            {onBookingDeleted && (
                                <>
                                    <Link to={`/bookingupdate/${booking.bookingId}`} className="me-2">Update</Link>
                                    <Link to="#"
                                        onClick={(event) => onBookingDeleted(booking.bookingId!)}
                                        className="btn btn-link text-danger"
                                    >Delete</Link>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default BookingTable;