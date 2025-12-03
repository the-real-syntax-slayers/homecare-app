export interface Booking {
    bookingId?: number;
    description: string;
    date: string;
    patientId: number;
    employeeId: number;
    availableDayId: number;
}