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

    // Simple frontend role support
    role: 'Admin' | 'Employee' | 'Patient';

    // Kobling til våre domene-modeller
    employeeId?: number;
    patientId?: number;
}