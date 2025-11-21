import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, MoreVertical, Edit, Trash2, MapPin } from 'lucide-react';
import { useBudgets } from '../hooks/useBudgets';
import { useExpenses } from '../hooks/useExpenses';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import TimelineTracker from '../components/common/TimelineTracker';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import categoriesData from '../mockData/categories.json';
import { formatStatus, getStatusVariant } from '../utils/formatStatus';

const expenseSchema = z.object({
    item: z.string().min(1, 'Item description is required'),
    category: z.string().min(1, 'Category is required'),
    cost: z.number().min(0.01, 'Cost must be greater than 0'),
    fundedBy: z.string().min(1, 'Funding source is required'),
    comments: z.string().optional(),
    date: z.string().min(1, 'Date is required'),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

const BudgetDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { budgets } = useBudgets();
    const { expenses, addExpense, deleteExpense } = useExpenses();
    const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
    const [expandedExpenseId, setExpandedExpenseId] = useState<string | null>(null);

    const budget = budgets.find((b) => b.id === id);
    const budgetExpenses = expenses.filter((e) => e.budgetId === id);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ExpenseFormData>({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
        },
    });

    if (!budget) {
        return <div>Budget not found</div>;
    }

    const totalSpent = budgetExpenses.reduce((acc, curr) => acc + curr.cost, 0);
    const remaining = budget.allocatedAmount - totalSpent;
    const progress = Math.min((totalSpent / budget.allocatedAmount) * 100, 100);

    const isEditable = budget.status === 'draft' || budget.status === 'submitted';

    const onSubmit = (data: ExpenseFormData) => {
        const newExpense = {
            id: `expense-${Date.now()}`,
            budgetId: budget.id,
            ...data,
            date: new Date(data.date).getTime() / 1000,
            status: 'draft' as const,
            statusHistory: [
                { stage: 'draft' as const, timestamp: Date.now() / 1000 },
            ],
            createdAt: Date.now() / 1000,
        };
        addExpense(newExpense);
        toast.success('Expense added successfully');
        setIsAddExpenseModalOpen(false);
        reset();
    };

    const handleDeleteExpense = (expenseId: string) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            deleteExpense(expenseId);
            toast.success('Expense deleted');
        }
    };

    const getTimelineStages = (expense: any) => {
        const stages = [
            { id: 'draft', label: 'Draft', status: 'pending' },
            { id: 'pending_review', label: 'Pending Review', status: 'pending' },
            { id: 'approved', label: 'Approved', status: 'pending' },
            { id: 'payment_processing', label: 'Payment', status: 'pending' },
            { id: 'completed', label: 'Completed', status: 'pending' },
        ];

        return stages.map((stage) => {
            const historyItem = expense.statusHistory.find((h: any) => h.stage === stage.id);

            if (expense.status === stage.id) {
                return { ...stage, status: 'active', date: historyItem?.timestamp };
            }

            if (historyItem) {
                return { ...stage, status: 'completed', date: historyItem.timestamp };
            }

            return { ...stage, status: 'pending' };
        }) as any;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
                <Button variant="ghost" onClick={() => navigate('/dashboard/budgets')}>
                    <ArrowLeft size={20} />
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-heading font-bold text-text-primary">{budget.name}</h1>
                    <p className="text-text-secondary">Academic Year: {budget.academicYear}</p>
                </div>
                <div className="flex space-x-2">
                    {isEditable && (
                        <Button variant="outline" icon={Edit}>
                            Edit Budget
                        </Button>
                    )}
                    <Button variant="ghost" icon={MoreVertical} />
                </div>
            </div>

            <Card className="bg-bg-card">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="p-4 bg-bg-secondary rounded-lg">
                        <p className="text-sm text-text-secondary">Allocated</p>
                        <p className="text-2xl font-bold text-text-primary">${budget.allocatedAmount.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-bg-secondary rounded-lg">
                        <p className="text-sm text-text-secondary">Spent</p>
                        <p className="text-2xl font-bold text-primary-blue">${totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-bg-secondary rounded-lg">
                        <p className="text-sm text-text-secondary">Remaining</p>
                        <p className="text-2xl font-bold text-status-success">${remaining.toLocaleString()}</p>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-text-primary">Budget Utilization</span>
                        <span className="text-text-secondary">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-bg-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary-blue rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </Card>

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-heading font-bold text-text-primary">Expenses</h2>
                <Button icon={Plus} onClick={() => setIsAddExpenseModalOpen(true)}>
                    Add Expense
                </Button>
            </div>

            <div className="bg-bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-bg-secondary border-b border-border">
                        <tr>
                            <th className="px-6 py-4 font-medium text-text-secondary">Item</th>
                            <th className="px-6 py-4 font-medium text-text-secondary">Category</th>
                            <th className="px-6 py-4 font-medium text-text-secondary">Cost</th>
                            <th className="px-6 py-4 font-medium text-text-secondary">Funded By</th>
                            <th className="px-6 py-4 font-medium text-text-secondary">Status</th>
                            <th className="px-6 py-4 font-medium text-text-secondary">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {budgetExpenses.map((expense) => (
                            <React.Fragment key={expense.id}>
                                <tr
                                    className="hover:bg-bg-secondary/50 transition-colors cursor-pointer"
                                    onClick={() => setExpandedExpenseId(expandedExpenseId === expense.id ? null : expense.id)}
                                >
                                    <td className="px-6 py-4 font-medium text-text-primary">{expense.item}</td>
                                    <td className="px-6 py-4 text-text-secondary">{expense.category}</td>
                                    <td className="px-6 py-4 font-medium text-text-primary">${expense.cost.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-text-secondary">{expense.fundedBy}</td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            variant={getStatusVariant(expense.status)}
                                        >
                                            {formatStatus(expense.status)}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <button
                                                className="text-text-secondary hover:text-accent-purple"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/dashboard/budgets/${budget.id}/track/${expense.id}`);
                                                }}
                                                title="Track Expense"
                                            >
                                                <MapPin size={16} />
                                            </button>
                                            <button className="text-text-secondary hover:text-primary-blue">
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="text-text-secondary hover:text-status-danger"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteExpense(expense.id);
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {expandedExpenseId === expense.id && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 bg-bg-secondary/30 border-b border-border">
                                            <TimelineTracker stages={getTimelineStages(expense)} />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        {budgetExpenses.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                                    No expenses found. Click "Add Expense" to create one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isAddExpenseModalOpen}
                onClose={() => setIsAddExpenseModalOpen(false)}
                title="Add New Expense"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Item Description"
                        placeholder="e.g., Keynote Speaker Travel"
                        error={errors.item?.message}
                        {...register('item')}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Category"
                            options={categoriesData.map(c => ({ value: c.name, label: c.name }))}
                            error={errors.category?.message}
                            {...register('category')}
                        />

                        <Input
                            label="Cost ($)"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            error={errors.cost?.message}
                            {...register('cost', { valueAsNumber: true })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Funded By"
                            options={[
                                { value: 'IEEE Chapter Fund', label: 'IEEE Chapter Fund' },
                                { value: 'University Grant', label: 'University Grant' },
                                { value: 'Corporate Sponsors', label: 'Corporate Sponsors' },
                                { value: 'Member Contributions', label: 'Member Contributions' },
                                { value: 'External Grants', label: 'External Grants' },
                                { value: 'Self-Funded', label: 'Self-Funded' },
                                { value: 'Other', label: 'Other' },
                            ]}
                            error={errors.fundedBy?.message}
                            {...register('fundedBy')}
                        />

                        <Input
                            label="Date"
                            type="date"
                            error={errors.date?.message}
                            {...register('date')}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-text-primary">Comments/Rationale</label>
                        <textarea
                            className="w-full rounded-lg border border-border bg-bg-primary px-4 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all"
                            rows={3}
                            placeholder="Provide justification..."
                            {...register('comments')}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsAddExpenseModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Add Expense</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default BudgetDetails;
