import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AvailableDayForm from './AvailableDayForm';
import { AvailableDay } from '../types/AvailableDay';
import * as AvailableDayService from './AvailableDayService';

const AvailableDayUpdatePage: React.FC = () => {
    const { availableDayId } = useParams<{ availableDayId: string }>(); // Get availableDayId from the URL
    const navigate = useNavigate(); // Create a navigate function
    const [availableDay, setAvailableDay] = useState<AvailableDay | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAvailableDay = async () => {
            try {
                const data = await AvailableDayService.fetchAvailableDayById(availableDayId!);
                setAvailableDay(data);
            } catch (error) {
                setError('Failed to fetch availableDay');
                console.error('There was a problem with the fetch operation:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableDay();
    }, [availableDayId]);

    const handleAvailableDayUpdated = async (availableDay: AvailableDay) => {

        try {
            const data = await AvailableDayService.updateAvailableDay(Number(availableDayId), availableDay);
            console.log('AvailableDay updated successfully:', data);
            navigate('/availableDays'); // Navigate back after successful creation
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!availableDay) return <p>No availableDay found</p>;

    return (
        <div>
            <h2>Update AvailableDay</h2>
            <AvailableDayForm onAvailableDayChanged={handleAvailableDayUpdated} availableDayId={availableDay.availableDayId} isUpdate={true} initialData={availableDay} />
        </div>
    );
};

export default AvailableDayUpdatePage;