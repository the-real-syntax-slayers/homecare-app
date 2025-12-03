import React from 'react';
import { Table } from 'react-bootstrap';
import { AvailableDay } from '../types/availableDay';
import { Link } from 'react-router-dom';

interface AvailableDayCalendarProps {
    availableDays: AvailableDay[];
    apiUrl: string;
    onAvailableDayDeleted?: (availableDayId: number) => void;
}

const AvailableDayCalendar: React.FC<AvailableDayCalendarProps> = ({ availableDays, apiUrl, onAvailableDayDeleted }) => {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>AvailableDayId</th>
                    <th>Date</th>
                    <th>EmployeeId</th> 
                    <th>Notes</th>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {availableDays.map(availableDay => (
                    <tr key={availableDay.availableDayId}>
                        <td>{availableDay.availableDayId}</td>
                        <td>{new Date(availableDay.date).toLocaleString()}</td>
                        <td>{availableDay.employeeId}</td>
                        <td>{availableDay.notes}</td>
                        <td className='text-center'>
                            {onAvailableDayDeleted && (
                                <>
                                    <Link to={`/availableDays/update/${availableDay.availableDayId}`} className="me-2">Update</Link>
                                    <Link to="#"
                                        onClick={(event) => onAvailableDayDeleted(availableDay.availableDayId!)}
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

export default AvailableDayCalendar;