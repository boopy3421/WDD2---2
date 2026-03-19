import { createContext, useContext, useMemo, useState } from 'react';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext(null);
const STORAGE_KEY = 'wdd2_user';

const getInitialUser = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getInitialUser);

    const login = async (payload) => {
        const data = await loginUser(payload);
        setUser(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
    };

    const register = async (payload) => {
        return registerUser(payload);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    const value = useMemo(
        () => ({
            user,
            isLoggedIn: Boolean(user?.token),
            isAdmin: String(user?.role || '').toLowerCase() === 'admin',
            login,
            register,
            logout,
        }),
        [user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
