import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { Booking } from '../types/booking';
import { AvailableDay } from '../types/availableDay';
import * as AvailableDayService from '../availableDays/AvailableDayService';
import { useAuth } from '../auth/AuthContext';

interface BookingFormProps {
    onBookingChanged: (booking: Booking) => Promise<void>;//new
    //onBookingChanged: (newBooking: Booking) => void;
    bookingId?: number;
    isUpdate?: boolean;
    initialData?: Booking;
}

const BookingForm: React.FC<BookingFormProps> = ({ onBookingChanged, bookingId, isUpdate = false, initialData }) => {
    const [description, setDescription] = useState<string>(initialData?.description || '');
    /*const [date, setDate] = useState<string>(initialData?.date || '');
    const [patientId, setPatientId] = useState<number>(1);
    const [employeeId, setEmployeeId] = useState<number>(1);
    const [availableDayId, setAvailabledayId] = useState<number>(1);*/

    const [availableDayId, setAvailableDayId] = useState<number | ''>('');//new
    const [availableDays, setAvailableDays] = useState<AvailableDay[]>([]);//new
    const { user } = useAuth();//new
    
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const onCancel = () => {
        navigate(-1); // This will navigate back one step in the history
    };

    /*
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const booking: Booking = { bookingId, description, date, patientId, employeeId, availableDayId};

        onBookingChanged(booking); // Call the passed function with the booking data
    };
    */

    useEffect(() => {
        const loadDays = async () => {
            const days = await AvailableDayService.fetchAvailableDays();
            setAvailableDays(days);
        };
        loadDays();
    }, []);

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

        // Enkel POC-logikk: hvis vi ikke kan lese et heltall fra tokenet,
        // bruker vi PatientId = 1

        // For updates, keep the existing patientId; for new bookings, use the logged-in patient
        const patientId = isUpdate && initialData?.patientId 
            ? initialData.patientId 
            : user.patientId;

        if (!patientId) {
            alert('You must be logged in as a patient to create a booking');
            return;
        }

        const booking: Booking = {
            bookingId: initialData?.bookingId,
            description,
            availableDayId: selected.availableDayId!,
            employeeId: selected.employeeId,
            date: new Date(selected.date).toISOString(),
            patientId: patientId
        };

        await onBookingChanged(booking);
        navigate('/bookings');
    };


    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBookingDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter booking description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    pattern="[0-9a-zA-ZæøåÆØÅ. \-]{10,250}" // Regular expression pattern
                    title="The Description must be numbers or letters and between 10 to 250 characters."
                />
            </Form.Group>
            {/*
            <Form.Group controlId="formBookingDate" className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="formPatientId" className="mb-3">
                <Form.Label>Patient Id</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="Enter patient id"
                    value={patientId}
                    onChange={(e) => setPatientId(Number(e.target.value))}
                    required
                    min="1"
                    step="1"
                />
            </Form.Group>

            <Form.Group controlId="formEmployeeId" className="mb-3">
                <Form.Label>Employee Id</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="Enter employee id"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(Number(e.target.value))}
                    required
                    min="1"
                    step="1"
                />
            </Form.Group>
            */}
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
                            {new Date(day.date).toLocaleDateString()} — Employee #{day.employeeId}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}

            <Button variant="primary" type="submit">Create Booking</Button>
            <Button variant="secondary" onClick={onCancel} className="ms-2">Cancel</Button>
        </Form>
    );
};

export default BookingForm;