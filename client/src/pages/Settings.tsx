import React from 'react';
import { User, Bell, Moon } from 'lucide-react';
import clsx from 'clsx';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

const Settings: React.FC = () => {
    const { state } = useAppContext();
    const { theme, toggleTheme } = useTheme();
    const { currentUser } = state;

    return (
        <div className="space-y-6 max-w-4xl">
            <h1 className="text-2xl font-heading font-bold text-text-primary">Settings</h1>

            <Card title="Profile Information">
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-primary-blue/10 rounded-full flex items-center justify-center text-primary-blue">
                            <User size={40} />
                        </div>
                        <div>
                            <Button variant="outline" size="sm">Change Avatar</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Username"
                            defaultValue={currentUser?.username}
                            readOnly
                        />
                        <Input
                            label="Email"
                            defaultValue={currentUser?.email}
                            readOnly
                        />
                        <Input
                            label="Role"
                            defaultValue={currentUser?.role}
                            readOnly
                        />
                        <Input
                            label="Member Since"
                            defaultValue={currentUser ? new Date(currentUser.createdAt * 1000).toLocaleDateString() : ''}
                            readOnly
                        />
                    </div>
                </div>
            </Card>

            <Card title="Preferences">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select
                            label="Timezone"
                            options={[
                                { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
                                { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
                                { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
                                { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
                                { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' },
                            ]}
                            defaultValue={currentUser?.timezone}
                        />

                        <Select
                            label="Date Format"
                            options={[
                                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                            ]}
                        />

                        <Select
                            label="Currency"
                            options={[
                                { value: 'USD', label: 'USD ($)' },
                                { value: 'EUR', label: 'EUR (€)' },
                                { value: 'GBP', label: 'GBP (£)' },
                            ]}
                        />
                    </div>

                    <div className="border-t border-border pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Moon size={20} className="text-text-secondary" />
                                <div>
                                    <p className="font-medium text-text-primary">Dark Mode</p>
                                    <p className="text-sm text-text-secondary">Toggle dark mode theme</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={toggleTheme}
                                aria-pressed={theme === 'dark'}
                                className={clsx(
                                    'relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue',
                                    theme === 'dark'
                                        ? 'bg-primary-blue text-white'
                                        : 'bg-bg-secondary border border-border'
                                )}
                            >
                                <span
                                    className={clsx(
                                        'inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-300 ease-in-out',
                                        theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                                    )}
                                />
                                <span className="sr-only">Toggle dark mode</span>
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Bell size={20} className="text-text-secondary" />
                                <div>
                                    <p className="font-medium text-text-primary">Email Notifications</p>
                                    <p className="text-sm text-text-secondary">Receive updates about budget approvals</p>
                                </div>
                            </div>
                            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-primary-blue cursor-pointer">
                                <span className="translate-x-6 inline-block w-6 h-6 transform bg-white rounded-full shadow-sm transition duration-200 ease-in-out" />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="flex justify-end space-x-4">
                <Button variant="secondary">Cancel</Button>
                <Button>Save Changes</Button>
            </div>
        </div>
    );
};

export default Settings;
