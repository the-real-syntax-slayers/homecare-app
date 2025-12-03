// src/bookings/BookingTable.tsx

import React from 'react';
import { Table } from 'react-bootstrap';
import { Booking } from '../types/booking';
import { Link } from 'react-router-dom';

interface BookingTableProps {
    bookings: Booking[];
    apiUrl: string;
    onBookingDeleted?: (bookingId: number) => void;
}

const BookingTable: React.FC<BookingTableProps> = ({ bookings, onBookingDeleted }) => {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>BookingId</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>PatientId</th>
                    <th>EmployeeId</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {bookings.map(booking => (
                    <tr key={booking.bookingId}>
                        <td>{booking.bookingId}</td>
                        <td>{booking.description}</td>
                        <td>{new Date(booking.date).toLocaleString()}</td>
                        <td>{booking.patientId}</td>
                        <td>{booking.employeeId}</td>
                        <td className="text-center">
                            {onBookingDeleted && (
                                <>
                                    <Link
                                        to={`/bookingupdate/${booking.bookingId}`}
                                        className="me-2"
                                    >
                                        Update
                                    </Link>
                                    <button
                                        type="button"
                                        className="btn btn-link text-danger p-0"
                                        onClick={() => onBookingDeleted(booking.bookingId!)}
                                    >
                                        Delete
                                    </button>
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
