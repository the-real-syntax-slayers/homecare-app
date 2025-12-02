const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
    // Read JWT token from localStorage using the standard getItem API
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
    if (response.ok) {  // HTTP status code success 200-299
        if (response.status === 204) { // Detele returns 204 No content
            return null;
        }
        return response.json(); // other returns response body as JSON
    } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Network response was not ok');
    }
};

// Get bookinglist
export const fetchBookings = async () => {
    const response = await fetch(`${API_URL}/api/bookingapi/bookinglist`);
    return handleResponse(response);
};
// Get booking by id
export const fetchBookingById = async (bookingId: string) => {
    const response = await fetch(`${API_URL}/api/bookingapi/${bookingId}`);
    return handleResponse(response);
};
// Post create booking
export const createBooking = async (booking: any) => {
    const response = await fetch(`${API_URL}/api/bookingapi/create`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(booking),
    });
    return handleResponse(response);
};
// Put update booking
export const updateBooking = async (bookingId: number, booking: any) => {
    const response = await fetch(`${API_URL}/api/bookingapi/update/${bookingId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(booking),
    });
    return handleResponse(response);
};
// Delete booking
export const deleteBooking = async (bookingId: number) => {
    const response = await fetch(`${API_URL}/api/bookingapi/delete/${bookingId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};