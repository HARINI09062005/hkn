import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Budgets from './pages/Budgets';
import BudgetDetails from './pages/BudgetDetails';
import Deadlines from './pages/Deadlines';
import Reports from './pages/Reports';
import History from './pages/History';
import Settings from './pages/Settings';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import VerifyOTPPage from './pages/auth/VerifyOTPPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import TrackExpensePage from './pages/TrackExpensePage';
import TrackingList from './pages/TrackingList';

function App() {
    return (
        <AppProvider>
            <AuthProvider>
                <Router>
                    <Toaster position="top-right" />
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/verify-otp" element={<VerifyOTPPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />

                        {/* Protected Dashboard Routes */}
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }>
                            <Route index element={<Dashboard />} />
                            <Route path="budgets" element={<Budgets />} />
                            <Route path="budgets/:id" element={<BudgetDetails />} />
                            <Route path="tracking" element={<TrackingList />} />
                            <Route path="budgets/:budgetId/track/:expenseId" element={<TrackExpensePage />} />
                            <Route path="deadlines" element={<Deadlines />} />
                            <Route path="reports" element={<Reports />} />
                            <Route path="history" element={<History />} />
                            <Route path="settings" element={<Settings />} />
                        </Route>
                    </Routes>
                </Router>
            </AuthProvider>
        </AppProvider>
    );
}

export default App;
