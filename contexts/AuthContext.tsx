import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { n8nService } from '../services/n8nService';

interface AuthUser {
    id: string;
    fullName?: string;
    role?: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: AuthUser | null;
    isLoading: boolean;
    login: (id: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = 'finauto_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const stored = sessionStorage.getItem(SESSION_KEY);
            if (stored) {
                setUser(JSON.parse(stored));
            }
        } catch {
            sessionStorage.removeItem(SESSION_KEY);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = useCallback(async (id: string, password: string): Promise<{ success: boolean; error?: string }> => {
        const result = await n8nService.login(id, password);

        // result.data is the full parsed response body:
        // { status: "success", message: "...", data: { id, full_name, role } }
        const body = result.data;
        const isSuccess = result.success && body?.status === 'success';

        if (isSuccess) {
            const payload = body.data;
            const authUser: AuthUser = {
                id: payload?.id || id,
                fullName: payload?.full_name || id,
                role: payload?.role || 'User',
            };
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
            setUser(authUser);
            return { success: true };
        }

        return { success: false, error: body?.message || result.error || 'Invalid credentials. Please try again.' };
    }, []);

    const logout = useCallback(() => {
        sessionStorage.removeItem(SESSION_KEY);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
