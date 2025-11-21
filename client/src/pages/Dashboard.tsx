import React from 'react';
import { ArrowUpRight, ArrowDownRight, Clock, AlertCircle } from 'lucide-react';
import { useBudgets } from '../hooks/useBudgets';
import { useExpenses } from '../hooks/useExpenses';
import { useDeadlines } from '../hooks/useDeadlines';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { formatStatus, getStatusVariant } from '../utils/formatStatus';
import SpendingChart from '../components/dashboard/SpendingChart';
import TrendChart from '../components/dashboard/TrendChart';
import BudgetUtilization from '../components/dashboard/BudgetUtilization';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
    const { budgets } = useBudgets();
    const { expenses } = useExpenses();
    const { deadlines } = useDeadlines();

    const totalAllocated = budgets.reduce((acc, curr) => acc + curr.allocatedAmount, 0);
    const totalSpent = expenses.reduce((acc, curr) => acc + curr.cost, 0);
    const remaining = totalAllocated - totalSpent;

    const recentTransactions = [...expenses]
        .sort((a, b) => b.date - a.date)
        .slice(0, 5);

    const upcomingDeadlines = [...deadlines]
        .filter((d) => d.status === 'upcoming')
        .sort((a, b) => a.dueDate - b.dueDate)
        .slice(0, 5);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-heading font-bold text-text-primary">Dashboard</h1>
                <div className="text-sm text-text-secondary">
                    Academic Year: <span className="font-medium text-text-primary">2024-2025</span>
                </div>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-primary-blue to-primary-dark text-white border-none">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Budget</p>
                            <h2 className="text-3xl font-bold mt-1">${totalAllocated.toLocaleString()}</h2>
                        </div>
                        <div className="p-2 bg-white/10 rounded-lg">
                            <ArrowUpRight className="text-white" size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-blue-100">
                        <span>Across {budgets.length} active budgets</span>
                    </div>
                </Card>

                <Card>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-text-secondary text-sm font-medium">Remaining Balance</p>
                            <h2 className="text-3xl font-bold mt-1 text-text-primary">${remaining.toLocaleString()}</h2>
                        </div>
                        <div className="p-2 bg-status-success/10 rounded-lg">
                            <ArrowDownRight className="text-status-success" size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-text-secondary">
                        <span className="text-status-success font-medium">{((remaining / totalAllocated) * 100).toFixed(1)}%</span>
                        <span className="ml-1">of total budget available</span>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Charts Section */}
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Spending Trends">
                        <TrendChart />
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title="Spending by Category">
                            <SpendingChart />
                        </Card>
                        <Card title="Budget Utilization">
                            <BudgetUtilization />
                        </Card>
                    </div>
                </div>

                {/* Sidebar Section */}
                <div className="space-y-6">
                    {/* Recent Transactions */}
                    <Card title="Recent Transactions">
                        <div className="space-y-4">
                            {recentTransactions.map((expense) => (
                                <div key={expense.id} className="flex items-center justify-between p-3 hover:bg-bg-secondary rounded-lg transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-primary-blue/10 flex items-center justify-center text-primary-blue font-bold">
                                            {expense.category.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-text-primary truncate max-w-[120px]">{expense.item}</p>
                                            <p className="text-xs text-text-secondary">{format(new Date(expense.date * 1000), 'MMM d')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-text-primary">-${expense.cost.toLocaleString()}</p>
                                        <Badge variant={getStatusVariant(expense.status)}>
                                            {formatStatus(expense.status)}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Upcoming Deadlines */}
                    <Card title="Upcoming Deadlines">
                        <div className="space-y-4">
                            {upcomingDeadlines.map((deadline) => (
                                <div key={deadline.id} className="p-3 border border-border rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-sm font-medium text-text-primary">{deadline.title}</h4>
                                        <Badge variant={deadline.priority === 'high' ? 'danger' : 'info'}>
                                            {deadline.priority}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center text-xs text-text-secondary space-x-4">
                                        <div className="flex items-center">
                                            <Clock size={14} className="mr-1" />
                                            {format(new Date(deadline.dueDate * 1000), 'MMM d')}
                                        </div>
                                        {deadline.amount && (
                                            <div className="flex items-center">
                                                <AlertCircle size={14} className="mr-1" />
                                                ${deadline.amount.toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
