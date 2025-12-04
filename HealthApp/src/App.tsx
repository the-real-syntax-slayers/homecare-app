// HealthApp/src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import HomePage from './home/HomePage'
import BookingGetAll from './bookings/BookingGetAll'
import BookingCreatePage from './bookings/BookingCreatePage'
import BookingUpdatePage from './bookings/BookingUpdatePage'
import AvailableDayGetAll from './availableDays/AvailableDayGetAll'
import AvailableDayCreatePage from './availableDays/AvailableDayCreatePage'
import AvailableDayUpdatePage from './availableDays/AvailableDayUpdatePage'
import NavMenu from './shared/NavMenu'
import LoginPage from './auth/LoginPage'
import RegisterPage from './auth/RegisterPage'
import ProtectedRoute from './auth/ProtectedRoute'
import { AuthProvider, useAuth } from './auth/AuthContext'
import './App.css'

// 1. Create a simple wrapper for Employee-only routes
const EmployeeRoute: React.FC = () => {
    const { user } = useAuth();
    // If not logged in or is a Patient, redirect to home
    if (!user || user.role === 'Patient') {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <NavMenu />
        {/* Using <div> instead of <Container> to allow 
        full-width background sections on pages.
        Content constraints are handled within individual page components.
        */}
        <div className="mt-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Routes accessible to ALL logged in users (Patient & Employee) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/bookings" element={<BookingGetAll />} />
              <Route path="/bookingcreate" element={<BookingCreatePage />} />
              <Route path="/bookingupdate/:bookingId" element={<BookingUpdatePage />} />
            </Route>

            {/* Routes accessible ONLY to Employees (and Admin) */}
            <Route element={<EmployeeRoute />}>
               <Route path="/availableDays" element={<AvailableDayGetAll />} />
               <Route path="/availableDayscreate" element={<AvailableDayCreatePage />} />
               <Route path="/availableDays/update/:availableDayId" element={<AvailableDayUpdatePage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App