import { User } from '../types';

const REGISTERED_USERS_KEY = 'registeredUsers';
const CURRENT_USER_KEY = 'currentUser';
const REMEMBER_ME_KEY = 'rememberMe';

// Initialize mock data if empty
export const initializeMockAuth = () => {
    const existingUsers = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!existingUsers) {
        const testUser = {
            id: 'user-001',
            name: 'Treasurer', // Added name property to match User type if needed, or adjust User type
            chapterName: 'IEEE HKN Demo Chapter',
            email: 'treasurer@ieee.org',
            password: 'Admin123!',
            role: 'treasurer', // Added role
            createdAt: 1700000000
        };
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify([testUser]));
    }
};

export const getRegisteredUsers = (): any[] => {
    return JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
};

export const getCurrentUser = (): User | null => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    if (!userStr) return null;
    return JSON.parse(userStr);
};

export const setCurrentUser = (user: User | null, remember: boolean = false) => {
    if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        if (remember) {
            localStorage.setItem(REMEMBER_ME_KEY, 'true');
        } else {
            localStorage.removeItem(REMEMBER_ME_KEY);
        }
    } else {
        localStorage.removeItem(CURRENT_USER_KEY);
        localStorage.removeItem(REMEMBER_ME_KEY);
    }
};

export const registerUser = (userData: any): User => {
    const users = getRegisteredUsers();
    const newUser = {
        id: `user-${Date.now()}`,
        ...userData,
        role: 'treasurer', // Default role
        createdAt: Date.now() / 1000
    };

    users.push(newUser);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    return newUser;
};

export const updatePassword = (email: string, newPassword: string) => {
    const users = getRegisteredUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
        return true;
    }
    return false;
    return false;
};

export const mockLogin = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const users = getRegisteredUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return { success: true, user: userWithoutPassword };
    }

    return { success: false, error: 'Invalid credentials' };
};

export const mockSignup = async (userData: any): Promise<{ success: boolean; user?: User; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const users = getRegisteredUsers();
    if (users.find(u => u.email === userData.email)) {
        return { success: false, error: 'User already exists' };
    }

    const newUser = registerUser(userData);
    const { password: _, ...userWithoutPassword } = newUser as any;
    return { success: true, user: userWithoutPassword };
};

export const mockLogout = () => {
    setCurrentUser(null);
};
