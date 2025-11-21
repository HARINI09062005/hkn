import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Navbar: React.FC = () => {
    const { state } = useAppContext();
    const { currentUser } = state;

    return (
        <header className="h-16 bg-bg-primary border-b border-border flex items-center justify-between px-6">
            <div className="flex items-center bg-bg-secondary rounded-lg px-3 py-2 w-96">
                <Search size={18} className="text-text-muted" />
                <input
                    type="text"
                    placeholder="Search transactions, budgets..."
                    className="bg-transparent border-none focus:outline-none ml-2 w-full text-sm text-text-primary placeholder-text-muted"
                />
            </div>

            <div className="flex items-center space-x-4">
                <button className="relative p-2 text-text-secondary hover:text-primary-blue transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-danger rounded-full"></span>
                </button>

                <div className="flex items-center space-x-3 pl-4 border-l border-border">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-text-primary">{currentUser?.username || 'User'}</p>
                        <p className="text-xs text-text-secondary capitalize">{currentUser?.role || 'Member'}</p>
                    </div>
                    <div className="w-10 h-10 bg-primary-blue/10 rounded-full flex items-center justify-center text-primary-blue">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
