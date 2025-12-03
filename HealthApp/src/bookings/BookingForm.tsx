import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Booking } from '../types/booking';
import { AvailableDay } from '../types/availableDay';
import * as AvailableDayService from './AvailableDayService';
import * as BookingService from './BookingService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface BookingFormProps {
    initialData?: Booking;
    onSubmit: (booking: Booking) => Promise<void>;
}

const BookingForm: React.FC<BookingFormProps> = ({ initialData, onSubmit }) => {
    const [description, setDescription] = useState(initialData?.description || '');
    const [availableDayId, setAvailableDayId] = useState<number | ''>('');
    const [availableDays, setAvailableDays] = useState<AvailableDay[]>([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Hent available days + bookings, og filtrer bort allerede bookede dager
    useEffect(() => {
        const loadData = async () => {
            const [days, bookings] = await Promise.all([
                AvailableDayService.fetchAvailableDays(),
                BookingService.fetchBookings()
            ]);

            const currentDayId = initialData?.availableDayId;

            const bookedIds = new Set(
                bookings
                    .filter(b => b.availableDayId !== undefined && b.availableDayId !== null)
                    .map(b => b.availableDayId!)
            );

            const freeDays = days.filter(d =>
                d.availableDayId !== undefined &&
                (
                    !bookedIds.has(d.availableDayId) ||          // ikke booket
                    d.availableDayId === currentDayId            // eller den dagen vi allerede har i en eksisterende booking
                )
            );

            setAvailableDays(freeDays);
        };

        loadData();
    }, [initialData]);

    // når vi er i edit-modus og har initialData: sett valgt dag
    useEffect(() => {
        if (initialData && initialData.availableDayId && availableDays.length > 0) {
            setAvailableDayId(initialData.availableDayId);
        }
    }, [initialData, availableDays]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert('You must be logged in');
            return;
        }

        if (!availableDayId) {
            alert('Please choose an available day');
            return;
        }

        const selected = availableDays.find(d => d.availableDayId === availableDayId);
        if (!selected) {
            alert('Selected day not found');
            return;
        }

        if (user.role === 'Patient' && !user.patientId) {
            alert('Could not determine patient id from username.');
            return;
        }

        const booking: Booking = {
            bookingId: initialData?.bookingId,
            description,
            availableDayId: selected.availableDayId!,
            employeeId: selected.employeeId,
            date: new Date(selected.date).toISOString(),
            // Pasient får sin egen id, admin/emp kan fortsatt bruke 1 som demo
            patientId: user.patientId ?? 1
        };

        await onSubmit(booking);
        navigate('/bookings');
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="description" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group controlId="availableDay" className="mb-3">
                <Form.Label>Select available day</Form.Label>
                <Form.Select
                    value={availableDayId}
                    onChange={(e) => setAvailableDayId(Number(e.target.value))}
                    required
                >
                    <option value="">Choose a day...</option>
                    {availableDays.map(day => (
                        <option key={day.availableDayId} value={day.availableDayId}>
                            {new Date(day.date).toLocaleString()} — Employee #{day.employeeId}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Button type="submit" className="btn btn-success">
                Save Booking
            </Button>
        </Form>
    );
};

export default BookingForm;
