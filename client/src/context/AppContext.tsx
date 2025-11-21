import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Budget, Expense, Deadline, User } from '../types';
import budgetsData from '../mockData/budgets.json';
import expensesData from '../mockData/expenses.json';
import deadlinesData from '../mockData/deadlines.json';
import usersData from '../mockData/users.json';

interface AppState {
    budgets: Budget[];
    expenses: Expense[];
    deadlines: Deadline[];
    currentUser: User | null;
    isLoading: boolean;
}

type Action =
    | { type: 'SET_INITIAL_DATA'; payload: { budgets: Budget[]; expenses: Expense[]; deadlines: Deadline[]; user: User } }
    | { type: 'ADD_BUDGET'; payload: Budget }
    | { type: 'UPDATE_BUDGET'; payload: Budget }
    | { type: 'DELETE_BUDGET'; payload: string }
    | { type: 'ADD_EXPENSE'; payload: Expense }
    | { type: 'UPDATE_EXPENSE'; payload: Expense }
    | { type: 'DELETE_EXPENSE'; payload: string }
    | { type: 'ADD_DEADLINE'; payload: Deadline }
    | { type: 'UPDATE_DEADLINE'; payload: Deadline }
    | { type: 'DELETE_DEADLINE'; payload: string };

const initialState: AppState = {
    budgets: [],
    expenses: [],
    deadlines: [],
    currentUser: null,
    isLoading: true,
};

const AppContext = createContext<{
    state: AppState;
    dispatch: React.Dispatch<Action>;
    logout: () => void;
} | undefined>(undefined);

const appReducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case 'SET_INITIAL_DATA':
            return {
                ...state,
                budgets: action.payload.budgets,
                expenses: action.payload.expenses,
                deadlines: action.payload.deadlines,
                currentUser: action.payload.user,
                isLoading: false,
            };
        case 'ADD_BUDGET':
            return { ...state, budgets: [...state.budgets, action.payload] };
        case 'UPDATE_BUDGET':
            return {
                ...state,
                budgets: state.budgets.map((b) => (b.id === action.payload.id ? action.payload : b)),
            };
        case 'DELETE_BUDGET':
            return { ...state, budgets: state.budgets.filter((b) => b.id !== action.payload) };
        case 'ADD_EXPENSE':
            return { ...state, expenses: [...state.expenses, action.payload] };
        case 'UPDATE_EXPENSE':
            return {
                ...state,
                expenses: state.expenses.map((e) => (e.id === action.payload.id ? action.payload : e)),
            };
        case 'DELETE_EXPENSE':
            return { ...state, expenses: state.expenses.filter((e) => e.id !== action.payload) };
        case 'ADD_DEADLINE':
            return { ...state, deadlines: [...state.deadlines, action.payload] };
        case 'UPDATE_DEADLINE':
            return {
                ...state,
                deadlines: state.deadlines.map((d) => (d.id === action.payload.id ? action.payload : d)),
            };
        case 'DELETE_DEADLINE':
            return { ...state, deadlines: state.deadlines.filter((d) => d.id !== action.payload) };
        default:
            return state;
    }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    useEffect(() => {
        // Simulate API call
        const loadData = async () => {
            await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
            dispatch({
                type: 'SET_INITIAL_DATA',
                payload: {
                    budgets: budgetsData as Budget[],
                    expenses: expensesData as Expense[],
                    deadlines: deadlinesData as Deadline[],
                    user: usersData[0] as User,
                },
            });
        };
        loadData();
    }, []);

    const logout = () => {
        // Clear all storage
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        localStorage.removeItem('rememberMe');
        // We might want to keep registeredUsers for demo purposes, but clearing current session is key
        sessionStorage.clear();

        dispatch({
            type: 'SET_INITIAL_DATA',
            payload: {
                budgets: [],
                expenses: [],
                deadlines: [],
                user: null as any, // Force null
            },
        });
    };

    return <AppContext.Provider value={{ state, dispatch, logout }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
