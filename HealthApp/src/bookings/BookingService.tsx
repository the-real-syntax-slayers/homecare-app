// src/bookings/BookingService.tsx
import { Booking } from '../types/booking';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

const handleResponse = async (response: Response) => {
    if (response.ok) {
        if (response.status === 204) {
            return null;
        }
        return response.json();
    } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Network response was not ok');
    }
};

// GET: api/bookings
export const fetchBookings = async (): Promise<Booking[]> => {
    const response = await fetch(`${API_URL}/api/bookings`);
    return handleResponse(response);
};

// GET: api/bookings/{id}
export const fetchBookingById = async (bookingId: string | number): Promise<Booking> => {
    const response = await fetch(`${API_URL}/api/bookings/${bookingId}`);
    return handleResponse(response);
};

// POST: api/bookings
export const createBooking = async (booking: Booking): Promise<Booking> => {
    const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(booking),
    });
    return handleResponse(response);
};

// PUT: api/bookings/{id}
export const updateBooking = async (bookingId: number, booking: Booking): Promise<Booking> => {
    const response = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(booking),
    });
    return handleResponse(response);
};

// DELETE: api/bookings/{id}
export const deleteBooking = async (bookingId: number): Promise<null> => {
    const response = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};
