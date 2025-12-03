import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import HomePage from './home/HomePage'
import BookingListPage from './bookings/BookingListPage'
import BookingCreatePage from './bookings/BookingCreatePage'
import BookingUpdatePage from './bookings/BookingUpdatePage'
import MyBookingsPage from './bookings/MyBookingsPage';
import AvailableDaysPage from './availabledays/AvailableDaysPage';
import NavMenu from './shared/NavMenu'
import LoginPage from './auth/LoginPage'
import RegisterPage from './auth/RegisterPage'
import ProtectedRoute from './auth/ProtectedRoute'
import { AuthProvider } from './auth/AuthContext'
import './App.css'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <NavMenu />
        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/bookings" element={<BookingListPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/mybookings" element={<MyBookingsPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/bookingcreate" element={<BookingCreatePage />} />
              <Route path="/bookingupdate/:bookingId" element={<BookingUpdatePage />} />
              <Route path="/availabledays" element={<AvailableDaysPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  )
}

export default App