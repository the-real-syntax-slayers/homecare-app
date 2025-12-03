import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User } from '../types/user';
import { LoginDto } from '../types/auth';
import * as authService from './AuthService';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (credentials: LoginDto) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hjelpefunksjon: dekode token + sett rolle + employeeId/patientId
const decodeUserWithRole = (token: string): User | null => {
    try {
        const decodedRaw: any = jwtDecode(token);

        if (!decodedRaw || typeof decodedRaw !== 'object') {
            return null;
        }

        const username = decodedRaw.sub as string | undefined;

        let role: User['role'] = 'Patient'; // default
        if (username === 'admin') {
            role = 'Admin';
        } else if (username && username.toLowerCase().startsWith('emp')) {
            role = 'Employee';
        } else {
            role = 'Patient';
        }

        // finn tall på slutten av brukernavnet, f.eks. patient1 -> 1
        let employeeId: number | undefined;
        let patientId: number | undefined;

        if (username) {
            const match = username.match(/(\d+)$/); // siste tall-sekvens
            const numericId = match ? Number(match[1]) : undefined;

            if (role === 'Employee' && numericId) {
                employeeId = numericId;
            } else if (role === 'Patient' && numericId) {
                patientId = numericId;
            }
        }

        const decodedUser: User = {
            ...(decodedRaw as object),
            role,
            employeeId,
            patientId,
        } as User;

        // sjekk utløp
        if (decodedUser.exp * 1000 <= Date.now()) {
            return null;
        }

        return decodedUser;
    } catch (error) {
        console.error('Invalid token', error);
        return null;
    }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (token) {
            const decodedUser = decodeUserWithRole(token);
            if (decodedUser) {
                setUser(decodedUser);
            } else {
                localStorage.removeItem('token');
                setUser(null);
                setToken(null);
            }
        }
        setIsLoading(false);
    }, [token]);

    const login = async (credentials: LoginDto) => {
        const { token } = await authService.login(credentials);
        localStorage.setItem('token', token);

        const decodedUser = decodeUserWithRole(token);
        if (!decodedUser) {
            localStorage.removeItem('token');
            setUser(null);
            setToken(null);
            throw new Error('Invalid token');
        }

        setUser(decodedUser);
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};