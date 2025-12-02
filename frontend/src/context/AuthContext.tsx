import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_URL } from '../lib/api';

interface User {
    id: string;
    email: string;
    name: string;
    username?: string;
    role: string;
    profilePicture?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string, username?: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const response = await fetch(`${API_URL}/api/users/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    // Token invalid
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            }
        }
        setLoading(false);
    }

    async function login(email: string, password: string) {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
    }

    async function signup(email: string, password: string, name: string, username?: string) {
        const response = await fetch(`${API_URL}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name, username }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Signup failed');
        }

        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
    }

    function logout() {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
            fetch(`${API_URL}/api/auth/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            }).catch(() => { });
        }

        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }

    async function refreshUser() {
        await checkAuth();
    }

    const value = {
        user,
        login,
        signup,
        logout,
        refreshUser,
        isAuthenticated: !!user,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
