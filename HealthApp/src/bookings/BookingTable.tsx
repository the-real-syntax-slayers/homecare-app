// HealthApp/src/bookings/BookingTable.tsx
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
    // Logic removed. We simply display the 'bookings' prop which is already filtered by the parent.
    
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>BookingId</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>PatientId</th>
                    <th>EmployeeId</th>
                    <th>AvailableDayId</th>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
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
                                        onClick={(event) => {
                                            event.preventDefault(); 
                                            onBookingDeleted(booking.bookingId!); 
                                        }}
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