// Defines structure for decoded JWT. Specifies vlaims contained
export interface User {
    sub: string; // Subject (username)
    email: string;
    nameid: string; // User ID
    jti: string;    // Unique identifier for the JWT
    iat: number;    // When JWT was issued
    exp: number;    // When JWT will expire
    iss: string;    // Identifies issuer
    aud: string;    // Identifies reciever of JWT

    role: 'Admin' | 'Employee' | 'Patient'; // User role (e.g., Admin, User)

    employeeId?: number; // Optional Employee ID
    patientId?: number; // Optional Patient ID
}