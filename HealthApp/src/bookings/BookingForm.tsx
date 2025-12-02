import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { Booking } from '../types/booking';


interface BookingFormProps {
    onBookingChanged: (newBooking: Booking) => void;
    bookingId?: number;
    isUpdate?: boolean;
    initialData?: Booking;
}

const BookingForm: React.FC<BookingFormProps> = ({ onBookingChanged, bookingId, isUpdate = false, initialData }) => {
    const [description, setDescription] = useState<string>(initialData?.description || '');
    const [date, setDate] = useState<string>(initialData?.date || '');
    const [patientId, setPatientId] = useState<number>(1);
    const [employeeId, setEmployeeId] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const onCancel = () => {
        navigate(-1); // This will navigate back one step in the history
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const booking: Booking = { bookingId, description, date, patientId, employeeId };
        onBookingChanged(booking); // Call the passed function with the booking data
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

            {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}

            <Button variant="primary" type="submit">Create Booking</Button>
            <Button variant="secondary" onClick={onCancel} className="ms-2">Cancel</Button>
        </Form>
    );
};

export default BookingForm;