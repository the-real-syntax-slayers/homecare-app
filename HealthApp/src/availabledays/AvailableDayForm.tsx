import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { AvailableDay } from '../types/availableDay';

interface AvailableDayFormProps {
    initialDay?: AvailableDay | null;
    isAdmin: boolean;
    isEmployee: boolean;
    userEmployeeId?: number;
    onSave: (day: AvailableDay) => Promise<void>;
    onCancelEdit: () => void;
    loading: boolean;
    error: string | null;
    onRefresh: () => void;
}

const toInputDateTime = (value: string | undefined): string => {
    if (!value) return '';
    const d = new Date(value);
    return d.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
};

const AvailableDayForm: React.FC<AvailableDayFormProps> = ({
    initialDay,
    isAdmin,
    isEmployee,
    userEmployeeId,
    onSave,
    onCancelEdit,
    loading,
    error,
    onRefresh,
}) => {
    const [date, setDate] = useState<string>('');
    const [employeeId, setEmployeeId] = useState<number>(1);
    const [notes, setNotes] = useState<string>('');

    useEffect(() => {
        if (initialDay) {
            setDate(toInputDateTime(initialDay.date));
            setEmployeeId(initialDay.employeeId);
            setNotes(initialDay.notes ?? '');
        } else {
            setDate('');
            setEmployeeId(1);
            setNotes('');
        }
    }, [initialDay]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!date) return;

        const effectiveEmployeeId =
            isEmployee && userEmployeeId ? userEmployeeId : employeeId;

        const day: AvailableDay = {
            availableDayId: initialDay?.availableDayId,
            date,
            employeeId: effectiveEmployeeId,
            notes,
        };

        await onSave(day);
    };

    const isEditing = !!initialDay?.availableDayId;

    return (
        <div>
            <Button
                onClick={onRefresh}
                className="btn btn-primary mb-3 me-2"
                disabled={loading}
            >
                {loading ? 'Loading…' : 'Refresh'}
            </Button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <h3>{isEditing ? 'Update available day' : 'Create new available day'}</h3>

            <Form onSubmit={handleSubmit} className="mb-4">
                <div className="d-flex flex-wrap gap-2 align-items-end">
                    <Form.Group controlId="availableDayDate">
                        <Form.Label>Date and time</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {isAdmin && (
                        <Form.Group controlId="availableDayEmployeeId">
                            <Form.Label>Employee Id</Form.Label>
                            <Form.Control
                                type="number"
                                min={1}
                                step={1}
                                value={employeeId}
                                onChange={(e) => setEmployeeId(Number(e.target.value))}
                                required
                            />
                        </Form.Group>
                    )}

                    {isEmployee && (
                        <Form.Group controlId="availableDayEmployeeId">
                            <Form.Label>Employee Id</Form.Label>
                            <Form.Control
                                type="number"
                                value={userEmployeeId ?? ''}
                                disabled
                                readOnly
                            />
                        </Form.Group>
                    )}

                    <Form.Group controlId="availableDayNotes">
                        <Form.Label>Notes</Form.Label>
                        <Form.Control
                            type="text"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Optional"
                        />
                    </Form.Group>

                    <Button type="submit" className="btn btn-success">
                        {isEditing ? 'Update' : 'Create'}
                    </Button>

                    {isEditing && (
                        <Button
                            type="button"
                            className="btn btn-secondary ms-2"
                            onClick={onCancelEdit}
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </Form>
        </div>
    );
};

export default AvailableDayForm;
