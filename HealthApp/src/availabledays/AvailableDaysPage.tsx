import React, { useEffect, useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { AvailableDay } from '../types/availableDay';
import * as AvailableDayService from '../availabledays/AvailableDayService';
import { useAuth } from '../auth/AuthContext';

const AvailableDaysPage: React.FC = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'Admin';
    const isEmployee = user?.role === 'Employee';

    const [days, setDays] = useState<AvailableDay[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // form-state
    const [date, setDate] = useState<string>('');
    const [employeeId, setEmployeeId] = useState<number>(1);
    const [notes, setNotes] = useState<string>('');

    // edit-mode
    const [editingId, setEditingId] = useState<number | null>(null);

    const fetchDays = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await AvailableDayService.fetchAvailableDays();

            let filtered = data;

            if (isEmployee && user?.employeeId) {
                filtered = data.filter(d => d.employeeId === user.employeeId);
            }
            // Admin ser alt, pasienter bør kanskje ikke ha tilgang hit i det hele tatt

            setDays(filtered);
        } catch (err) {
            // ...
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchDays();
    }, []);

    const resetForm = () => {
        setDate('');
        setEmployeeId(1);
        setNotes('');
        setEditingId(null);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!date) {
            setError('Date is required');
            return;
        }

        // Hvis ansatt: lås employeeId til egen id
        const effectiveEmployeeId =
            isEmployee && user?.employeeId ? user.employeeId : employeeId;

        const day: AvailableDay = {
            availableDayId: editingId ?? undefined,
            date,
            employeeId: effectiveEmployeeId,
            notes,
        };




        try {
            if (editingId !== null) {
                // UPDATE
                const updated = await AvailableDayService.updateAvailableDay(editingId, day);
                setDays(prev =>
                    prev.map(d => (d.availableDayId === editingId ? updated : d))
                );
            } else {
                // CREATE
                const created = await AvailableDayService.createAvailableDay(day);
                setDays(prev => [...prev, created]);
            }
            resetForm();
        } catch (err) {
            console.error('Error saving available day', err);
            setError('Failed to save available day.');
        }
    };

    const handleEdit = (day: AvailableDay) => {
        if (!day.availableDayId) return;
        setEditingId(day.availableDayId);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm(`Delete available day ${id}?`)) return;

        try {
            await AvailableDayService.deleteAvailableDay(id);
            setDays(prev => prev.filter(d => d.availableDayId !== id));
            // hvis du slettet det du redigerte – nullstill form
            if (editingId === id) resetForm();
        } catch (err) {
            console.error('Error deleting available day', err);
            setError('Failed to delete available day.');
        }
    };

    if (!user) {
        return <p>You must be logged in to view available days.</p>;
    }

    return (
        <div>
            <h1>Available days</h1>

            <Button
                onClick={fetchDays}
                className="btn btn-primary mb-3 me-2"
                disabled={loading}
            >
                {loading ? 'Loading…' : 'Refresh'}
            </Button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <h3>{editingId !== null ? 'Update available day' : 'Create new available day'}</h3>
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
                                value={user?.employeeId ?? ''}
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
                        {editingId !== null ? 'Update' : 'Create'}
                    </Button>

                    {editingId !== null && (
                        <Button
                            type="button"
                            className="btn btn-secondary ms-2"
                            onClick={resetForm}
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </Form>

            <h3>Existing available days</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Date</th>
                        <th>EmployeeId</th>
                        <th>Notes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {days.map(day => (
                        <tr key={day.availableDayId}>
                            <td>{day.availableDayId}</td>
                            <td>{new Date(day.date).toLocaleDateString()}</td>
                            <td>{day.employeeId}</td>
                            <td>{day.notes}</td>
                            <td className="text-center">
                                <Button
                                    variant="link"
                                    className="p-0 me-2"
                                    onClick={() => handleEdit(day)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="link"
                                    className="text-danger p-0"
                                    onClick={() => handleDelete(day.availableDayId!)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default AvailableDaysPage;
