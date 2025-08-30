import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState } from '@/types';
import apiClientWithCSRF, { getCsrfToken } from '@/services/apiWithCSRF';

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<boolean>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProviderWithCSRF: React.FC<AuthProviderProps> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        token: localStorage.getItem('token'),
        isAuthenticated: false,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            // İlk olarak CSRF token'ını al
            await getCsrfToken();
            
            const token = localStorage.getItem('token');
            if (token) {
                apiClientWithCSRF.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                await fetchUser();
            } else {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await apiClientWithCSRF.get('/user');
            setAuthState({
                user: response.data.user,
                token: localStorage.getItem('token'),
                isAuthenticated: true,
            });
        } catch (error) {
            localStorage.removeItem('token');
            delete apiClientWithCSRF.defaults.headers.common['Authorization'];
            setAuthState({
                user: null,
                token: null,
                isAuthenticated: false,
            });
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            // Login öncesi CSRF token'ını yenile
            await getCsrfToken();
            
            const response = await apiClientWithCSRF.post('/auth/login', { email, password });
            const { token, user } = response.data;
            
            localStorage.setItem('token', token);
            apiClientWithCSRF.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            setAuthState({
                user,
                token,
                isAuthenticated: true,
            });
            
            return true;
        } catch (error) {
            console.error('Login error:', error);
            localStorage.removeItem('token');
            delete apiClientWithCSRF.defaults.headers.common['Authorization'];
            return false;
        }
    };

    const register = async (name: string, email: string, password: string, passwordConfirmation: string): Promise<boolean> => {
        try {
            // Register öncesi CSRF token'ını yenile
            await getCsrfToken();
            
            const response = await apiClientWithCSRF.post('/auth/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
            const { token, user } = response.data;
            
            localStorage.setItem('token', token);
            apiClientWithCSRF.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            setAuthState({
                user,
                token,
                isAuthenticated: true,
            });
            
            return true;
        } catch (error) {
            console.error('Register error:', error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await apiClientWithCSRF.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            delete apiClientWithCSRF.defaults.headers.common['Authorization'];
            setAuthState({
                user: null,
                token: null,
                isAuthenticated: false,
            });
        }
    };

    return (
        <AuthContext.Provider value={{
            ...authState,
            login,
            logout,
            register,
            loading,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthWithCSRF = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthWithCSRF must be used within an AuthProviderWithCSRF');
    }
    return context;
};
