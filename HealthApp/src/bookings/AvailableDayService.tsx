// src/bookings/AvailableDayService.tsx

import { AvailableDay } from '../types/availableDay';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

const handleResponse = async (response: Response) => {
    if (response.ok) {
        if (response.status === 204) return null;
        return await response.json();
    } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Network response was not ok');
    }
};

export const fetchAvailableDays = async (): Promise<AvailableDay[]> => {
    const response = await fetch(`${API_URL}/api/availabledays`);
    return handleResponse(response);
};

export const createAvailableDay = async (day: AvailableDay): Promise<AvailableDay> => {
    const response = await fetch(`${API_URL}/api/availabledays`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(day),
    });
    return handleResponse(response);
};

export const updateAvailableDay = async (
    id: number,
    day: AvailableDay
): Promise<AvailableDay> => {
    const response = await fetch(`${API_URL}/api/availabledays/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(day),
    });
    return handleResponse(response);
};

export const deleteAvailableDay = async (id: number): Promise<null> => {
    const response = await fetch(`${API_URL}/api/availabledays/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};
