import React, { useState } from 'react';
import { Plus, Filter, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBudgets } from '../hooks/useBudgets';
import { useExpenses } from '../hooks/useExpenses';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';

const budgetSchema = z.object({
    name: z.string().min(1, 'Budget name is required'),
    allocatedAmount: z.number().min(0.01, 'Amount must be greater than 0'),
    academicYear: z.string().min(1, 'Academic year is required'),
    description: z.string().optional(),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

const Budgets: React.FC = () => {
    const navigate = useNavigate();
    const { budgets, addBudget, deleteBudget } = useBudgets();
    const { expenses } = useExpenses();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this budget?')) {
            deleteBudget(id);
            toast.success('Budget deleted successfully');
        }
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<BudgetFormData>({
        resolver: zodResolver(budgetSchema),
        defaultValues: {
            academicYear: '2024-2025',
        },
    });

    const onSubmit = (data: BudgetFormData) => {
        const newBudget = {
            id: `budget-${Date.now()}`,
            ...data,
            status: 'draft' as const,
            createdAt: Date.now() / 1000,
            expenses: [],
        };
        addBudget(newBudget);
        toast.success('Budget created successfully');
        setIsCreateModalOpen(false);
        reset();
    };

    const getBudgetStats = (budgetId: string, allocated: number) => {
        const budgetExpenses = expenses.filter((e) => e.budgetId === budgetId);
        const spent = budgetExpenses.reduce((acc, curr) => acc + curr.cost, 0);
        const percentage = Math.min((spent / allocated) * 100, 100);
        return { spent, percentage, remaining: allocated - spent };
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-heading font-bold text-text-primary">Budget Management</h1>
                <div className="flex space-x-3">
                    <Button variant="outline" icon={Filter}>
                        Filter
                    </Button>
                    <Button icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
                        Create Budget
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgets.map((budget) => {
                    const stats = getBudgetStats(budget.id, budget.allocatedAmount);
                    return (
                        <Card key={budget.id} className="hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-heading font-semibold text-text-primary">{budget.name}</h3>
                                    <p className="text-sm text-text-secondary">{budget.academicYear}</p>
                                </div>
                                <Badge
                                    variant={
                                        budget.status === 'approved'
                                            ? 'success'
                                            : budget.status === 'draft'
                                                ? 'info'
                                                : 'warning'
                                    }
                                >
                                    {budget.status}
                                </Badge>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-text-secondary">Allocated</span>
                                        <span className="font-medium text-text-primary">${budget.allocatedAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-text-secondary">Spent</span>
                                        <span className="font-medium text-text-primary">
                                            ${stats.spent.toLocaleString()} ({stats.percentage.toFixed(1)}%)
                                        </span>
                                    </div>
                                    <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary-blue rounded-full"
                                            style={{ width: `${stats.percentage}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-text-secondary">Remaining</p>
                                        <p className="text-lg font-bold text-status-success">${stats.remaining.toLocaleString()}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(budget.id)}
                                            className="text-status-danger hover:text-red-700 hover:bg-status-danger/10"
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => navigate(`/dashboard/budgets/${budget.id}`)}
                                            className="text-primary-blue hover:text-primary-dark hover:bg-primary-blue/10"
                                        >
                                            View Details <ChevronRight size={16} className="ml-1" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-text-muted text-right">
                                    ID: {budget.id}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Budget"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Budget Name"
                        placeholder="e.g., IEEE Workshop 2024"
                        error={errors.name?.message}
                        {...register('name')}
                    />

                    <Input
                        label="Allocated Amount ($)"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        error={errors.allocatedAmount?.message}
                        {...register('allocatedAmount', { valueAsNumber: true })}
                    />

                    <Select
                        label="Academic Year"
                        options={[
                            { value: '2023-2024', label: '2023-2024' },
                            { value: '2024-2025', label: '2024-2025' },
                            { value: '2025-2026', label: '2025-2026' },
                        ]}
                        error={errors.academicYear?.message}
                        {...register('academicYear')}
                    />

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-primary">Description</label>
                        <textarea
                            className="w-full rounded-lg border border-border bg-bg-primary px-4 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all"
                            rows={3}
                            placeholder="Optional description..."
                            {...register('description')}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Create Budget</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Budgets;
