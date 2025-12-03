import React, { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { Booking } from '../types/booking';
import { Link } from 'react-router-dom';
import * as BookingService from './BookingService';

interface BookingCalendarProps {
    // We keep this to satisfy the interface from BookingGetAll, 
    // but we will fetch specific monthly data internally.
    bookings?: Booking[]; 
    apiUrl: string;
    onBookingDeleted?: (bookingId: number) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ apiUrl, onBookingDeleted }) => {
    // State for the calendar view
    const [currentDate, setCurrentDate] = useState(new Date());
    // Local state to hold bookings for the current month
    const [monthlyBookings, setMonthlyBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-indexed (0 = Jan)

    // Fetch data when the month changes
    useEffect(() => {
        const loadMonthData = async () => {
            setLoading(true);
            try {
                // Backend expects month 1-12, JS provides 0-11
                const data = await BookingService.fetchBookingsByMonth(currentYear, currentMonth + 1);
                setMonthlyBookings(data);
            } catch (error) {
                console.error("Failed to load monthly bookings", error);
            } finally {
                setLoading(false);
            }
        };
        loadMonthData();
    }, [currentYear, currentMonth]); // Re-run whenever year or month changes

    // --- Calendar Logic ---
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Calculate start offset (0=Mon ... 6=Sun)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const originalStartDayOffset = firstDayOfMonth.getDay();
    const startDayOffset = originalStartDayOffset === 0 ? 6 : originalStartDayOffset - 1;

    // Navigation
    const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

    const isSameDate = (date1: Date, date2: Date) => {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const today = new Date();

    return (
        <div className="container p-0">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Button variant="outline-secondary" onClick={prevMonth}>&laquo; Previous</Button>
                <h2 className="m-0">{monthNames[currentMonth]} {currentYear}</h2>
                <Button variant="outline-secondary" onClick={nextMonth}>Next &raquo;</Button>
            </div>

            {/* Loading Indicator */}
            {loading && (
                <div className="text-center mb-2">
                    <Spinner animation="border" size="sm" /> Updating...
                </div>
            )}

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '1px',
                backgroundColor: '#ddd',
                border: '1px solid #ddd'
            }}>
                {/* Weekday Headers */}
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="text-center fw-bold p-2 bg-light">
                        {day}
                    </div>
                ))}

                {/* Empty Padding Cells */}
                {Array.from({ length: startDayOffset }).map((_, i) => (
                    <div key={`empty-${i}`} className="bg-white" style={{ minHeight: '120px' }}></div>
                ))}

                {/* Day Cells */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const cellDate = new Date(currentYear, currentMonth, day);
                    const isToday = isSameDate(cellDate, today);

                    // Filter from the specific monthly data
                    const dayBookings = monthlyBookings.filter(b => 
                        isSameDate(new Date(b.date), cellDate)
                    );

                    return (
                        <div key={day} className={`p-2 d-flex flex-column ${isToday ? 'bg-info-subtle' : 'bg-white'}`} style={{ minHeight: '120px' }}>
                            <div className={`mb-2 fw-medium ${isToday ? 'fw-bold' : ''}`}>
                                {day}
                            </div>

                            <div className="flex-grow-1 overflow-auto">
                                {dayBookings.map(booking => (
                                    <div key={booking.bookingId} className="border rounded p-1 mb-1 bg-light shadow-sm" style={{ fontSize: '0.85em' }}>
                                        <strong>{booking.description}</strong>
                                        <div className="text-secondary my-1" style={{ fontSize: '0.9em' }}>
                                            {new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <br />
                                            <span title="Patient ID">P: {booking.patientId}</span> | <span title="Employee ID">E: {booking.employeeId}</span>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <Link to={`/bookingupdate/${booking.bookingId}`}>Update</Link>
                                            {onBookingDeleted && (
                                                <a 
                                                    href="#" 
                                                    className="text-danger"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if(onBookingDeleted) onBookingDeleted(booking.bookingId!);
                                                        // Update local state to remove item immediately
                                                        setMonthlyBookings(prev => prev.filter(b => b.bookingId !== booking.bookingId));
                                                    }}
                                                >
                                                    Delete
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BookingCalendar;