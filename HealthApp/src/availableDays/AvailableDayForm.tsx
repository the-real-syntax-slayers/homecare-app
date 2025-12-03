import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { AvailableDay } from '../types/availableDay';


interface AvailableDayFormProps {
    onAvailableDayChanged: (newAvailableDay: AvailableDay) => void;
    availableDayId?: number;
    isUpdate?: boolean;
    initialData?: AvailableDay;
}

const AvailableDayForm: React.FC<AvailableDayFormProps> = ({ onAvailableDayChanged, availableDayId, isUpdate = false, initialData }) => {
    const [date, setDate] = useState<string>(initialData?.date || '');
    const [employeeId, setEmployeeId] = useState<number>(1);
    const [notes, setDescription] = useState<string>(initialData?.notes || '');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const onCancel = () => {    
        navigate(-1); // This will navigate back one step in the history
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const availableDay: AvailableDay = { availableDayId, date, employeeId, notes};
        onAvailableDayChanged(availableDay); // Call the passed function with the availableDay data
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formAvailableDayDate" className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
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

            <Form.Group controlId="formAvailableDayNotes">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter availableDay description"
                    value={notes}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    pattern="[0-9a-zA-ZæøåÆØÅ. \-]{10,250}" // Regular expression pattern
                    title="The Description must be numbers or letters and between 10 to 250 characters."
                />
            </Form.Group>

            {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}

            <Button variant="primary" type="submit">Create AvailableDay</Button>
            <Button variant="secondary" onClick={onCancel} className="ms-2">Cancel</Button>
        </Form>
    );
};

export default AvailableDayForm;