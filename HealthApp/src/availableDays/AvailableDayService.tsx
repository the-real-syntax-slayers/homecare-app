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

// Get availableDaylist
export const fetchAvailableDays = async () => {
    const response = await fetch(`${API_URL}/api/AvailableDays/GetAll`);
    return handleResponse(response);
};
// Get availableDay by id
export const fetchAvailableDayById = async (availableDayId: string) => {
    const response = await fetch(`${API_URL}/api/AvailableDays/GetById${availableDayId}`);
    return handleResponse(response);
};
// Post create availableDay
export const createAvailableDay = async (availableDay: any) => {
    const response = await fetch(`${API_URL}/api/AvailableDays/create`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(availableDay),
    });
    return handleResponse(response);
};
// Put update availableDay
export const updateAvailableDay = async (availableDayId: number, availableDay: any) => {
    const response = await fetch(`${API_URL}/api/AvailableDays/update/${availableDayId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(availableDay),
    });
    return handleResponse(response);
};
// Delete availableDay
export const deleteAvailableDay = async (availableDayId: number) => {
    const response = await fetch(`${API_URL}/api/AvailableDays/delete/${availableDayId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};