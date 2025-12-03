import React from 'react';
import { useNavigate } from 'react-router-dom';
import AvailableDayForm from './AvailableDayForm';
import { AvailableDay } from '../types/availableDay';
import * as AvailableDayService from './AvailableDayService';

const AvailableDayCreatePage: React.FC = () => {
    const navigate = useNavigate(); // Create a navigate function

    const handleAvailableDayCreated = async (availableDay: AvailableDay) => {
        try {
            const data = await AvailableDayService.createAvailableDay(availableDay);
            console.log('AvailableDay created successfully:', data);
            navigate('/availableDays'); // Navigate back after successful creation
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    return (
        <div>
            <h2>Create New AvailableDay</h2>
            <AvailableDayForm onAvailableDayChanged={handleAvailableDayCreated} />
        </div>
    );
};

export default AvailableDayCreatePage;