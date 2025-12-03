import React from 'react';
import { Table } from 'react-bootstrap';
import { Booking } from '../types/booking';
import { Link } from 'react-router-dom';

interface BookingCalendarProps {
    bookings: Booking[];
    apiUrl: string;
    onBookingDeleted?: (bookingId: number) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ bookings, apiUrl, onBookingDeleted }) => {
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
                {bookings.map(booking => (
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

export default BookingCalendar;