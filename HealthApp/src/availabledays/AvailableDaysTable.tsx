import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { AvailableDay } from '../types/availableDay';

interface AvailableDaysTableProps {
    days: AvailableDay[];
    onEdit: (day: AvailableDay) => void;
    onDelete: (id: number) => void;
}

const AvailableDaysTable: React.FC<AvailableDaysTableProps> = ({
    days,
    onEdit,
    onDelete,
}) => {
    return (
        <div>
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
                            <td>{new Date(day.date).toLocaleString()}</td>
                            <td>{day.employeeId}</td>
                            <td>{day.notes}</td>
                            <td className="text-center">
                                <Button
                                    variant="link"
                                    className="p-0 me-2"
                                    onClick={() => onEdit(day)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="link"
                                    className="text-danger p-0"
                                    onClick={() => onDelete(day.availableDayId!)}
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

export default AvailableDaysTable;
