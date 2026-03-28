import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Portfolio from './pages/Portfolio';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { PortfolioProvider } from './context/PortfolioContext';

function App() {
    return (
        <PortfolioProvider>
            <BrowserRouter>
            <Routes>
                {/* Main Portfolio Route */}
                <Route path="/" element={<Portfolio />} />
                
                {/* Admin Authentication Routes */}
                <Route path="/login/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                {/* Catch-all redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
        </PortfolioProvider>
    );
}

export default App;
