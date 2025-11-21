import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { mockLogin, mockSignup, mockLogout } from '../utils/mockAuth';
import { useAppContext } from './AppContext';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
    signup: (userData: any) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { state, logout: appLogout } = useAppContext();
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for persisted user
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsAuthenticated(true);
            } catch (e) {
                console.error('Failed to parse stored user');
                localStorage.removeItem('currentUser');
            }
        }
        setIsLoading(false);
    }, []);

    // Sync with AppContext state if needed, but AuthContext is primary for auth
    useEffect(() => {
        if (state.currentUser && !user) {
            setUser(state.currentUser);
            setIsAuthenticated(true);
        }
    }, [state.currentUser]);

    const login = async (email: string, password: string, rememberMe: boolean) => {
        setIsLoading(true);
        try {
            const result = await mockLogin(email, password);
            if (result.success && result.user) {
                setUser(result.user);
                setIsAuthenticated(true);
                if (rememberMe) {
                    localStorage.setItem('currentUser', JSON.stringify(result.user));
                } else {
                    sessionStorage.setItem('currentUser', JSON.stringify(result.user));
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (userData: any) => {
        setIsLoading(true);
        try {
            const result = await mockSignup(userData);
            if (result.success && result.user) {
                setUser(result.user);
                setIsAuthenticated(true);
                localStorage.setItem('currentUser', JSON.stringify(result.user));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Signup error:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        mockLogout();
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        appLogout(); // Clear AppContext data
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
