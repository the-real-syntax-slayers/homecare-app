import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { Booking } from '../types/booking';
import { AvailableDay } from '../types/availableDay';
import * as AvailableDayService from '../availableDays/AvailableDayService';
import { useAuth } from '../auth/AuthContext';

interface BookingFormProps {
    onBookingChanged: (booking: Booking) => Promise<void>;
    bookingId?: number;
    isUpdate?: boolean;
    initialData?: Booking;
}

const BookingForm: React.FC<BookingFormProps> = ({ onBookingChanged, bookingId, isUpdate = false, initialData }) => {
    const [description, setDescription] = useState<string>(initialData?.description || '');
    const [availableDayId, setAvailableDayId] = useState<number | ''>('');
    const [availableDays, setAvailableDays] = useState<AvailableDay[]>([]);
    const { user } = useAuth();
    
    // Simple: just take first 16 chars (YYYY-MM-DDTHH:mm) from ISO string
    const [date, setDate] = useState<string>(initialData?.date ? initialData.date.slice(0, 16) : '');
    const [employeeId, setEmployeeId] = useState<number>(initialData?.employeeId || 1);
    const [patientId, setPatientId] = useState<number>(initialData?.patientId || user?.patientId || 0);
    
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const onCancel = () => {
        navigate(-1);
    };

    useEffect(() => {
        const loadDays = async () => {
            const days = await AvailableDayService.fetchAvailableDays();
            setAvailableDays(days);
        };
        if (!isUpdate) {
            loadDays();
        }
    }, [isUpdate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert('You must be logged in');
            return;
        }

        if (isUpdate) {
            // UPDATE MODE
            if (user.role === 'Employee' || user.role === 'Admin') {
                if (!date) {
                    alert('Please enter a date');
                    return;
                }
                if (!patientId) {
                    alert('Please enter a patient ID');
                    return;
                }

                // Simple: append ":00" to make it ISO-like, backend will parse it
                const booking: Booking = {
                    bookingId: initialData?.bookingId,
                    description,
                    date: date + ':00', // datetime-local is "YYYY-MM-DDTHH:mm", add seconds
                    employeeId: employeeId,
                    patientId: patientId,
                    availableDayId: initialData?.availableDayId
                };

                await onBookingChanged(booking);
                navigate('/bookings');
            } else if (user.role === 'Patient') {
                const booking: Booking = {
                    bookingId: initialData?.bookingId,
                    description,
                    date: initialData?.date || '',
                    employeeId: initialData?.employeeId || 0,
                    patientId: initialData?.patientId || 0,
                    availableDayId: initialData?.availableDayId
                };

                await onBookingChanged(booking);
                navigate('/bookings');
            }
        } else {
            // CREATE MODE
            if (!availableDayId) {
                alert('Please choose an available day');
                return;
            }

            const selected = availableDays.find(d => d.availableDayId === availableDayId);
            if (!selected) {
                alert('Selected day not found');
                return;
            }

            let finalPatientId: number;
            if (user.role === 'Employee' || user.role === 'Admin') {
                if (!patientId) {
                    alert('Please enter a patient ID');
                    return;
                }
                finalPatientId = patientId;
            } else {
                finalPatientId = user.patientId || 0;
                if (!finalPatientId) {
                    alert('You must be logged in as a patient to create a booking');
                    return;
                }
            }

            // Simple: just take first 19 chars (YYYY-MM-DDTHH:mm:ss) from selected date
            const isoDate = selected.date.slice(0, 19);

            const booking: Booking = {
                bookingId: initialData?.bookingId,
                description,
                availableDayId: selected.availableDayId!,
                employeeId: selected.employeeId,
                date: isoDate,
                patientId: finalPatientId
            };

            await onBookingChanged(booking);
            navigate('/bookings');
        }
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
                    pattern="[0-9a-zA-ZæøåÆØÅ. \-]{10,250}"
                    title="The Description must be numbers or letters and between 10 to 250 characters."
                />
            </Form.Group>

            {(user?.role === 'Employee' || user?.role === 'Admin') && (
                <Form.Group controlId="formPatientId" className="mb-3">
                    <Form.Label>Patient Id</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter patient id"
                        value={patientId || ''}
                        onChange={(e) => setPatientId(Number(e.target.value))}
                        required
                        min="1"
                        step="1"
                    />
                </Form.Group>
            )}

            {!isUpdate && (
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
            )}

            {isUpdate && (user?.role === 'Employee' || user?.role === 'Admin') && (
                <>
                    <Form.Group controlId="formBookingDate" className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
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
                </>
            )}

            {isUpdate && user?.role === 'Patient' && initialData && (
                <div className="mb-3">
                    <p><strong>Date:</strong> {new Date(initialData.date).toLocaleString()}</p>
                    <p><strong>Employee ID:</strong> {initialData.employeeId}</p>
                    <p><strong>Patient ID:</strong> {initialData.patientId}</p>
                </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <Button variant="primary" type="submit">
                {isUpdate ? 'Update Booking' : 'Create Booking'}
            </Button>
            <Button variant="secondary" onClick={onCancel} className="ms-2">Cancel</Button>
        </Form>
    );
};

export default BookingForm;