import React from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import AuthSection from '../auth/AuthSection';
import { useAuth } from '../auth/AuthContext';

const NavMenu: React.FC = () => {
    const { user } = useAuth();

    const canSeeAvailableDays =
        user && (user.role === 'Admin' || user.role === 'Employee');

    const renderRoleBadge = () => {
        if (!user) return null;

        if (user.role === 'Admin') {
            return (
                <span className="badge bg-danger ms-2">
                    ADMIN
                </span>
            );
        }

        if (user.role === 'Employee') {
            return (
                <span className="badge bg-info text-dark ms-2">
                    EMPLOYEE
                </span>
            );
        }

        // Patient: ingen badge
        return null;
    };

    return (
        <Navbar expand="lg">
            <Navbar.Brand href="/">
                HomecareApp
                {renderRoleBadge()}
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/bookings">Bookings</Nav.Link>

                    {canSeeAvailableDays && (
                        <Nav.Link href="/availabledays">Available days</Nav.Link>
                    )}
                    {user && user.role === 'Patient' && (
                        <Nav.Link href="/mybookings">My bookings</Nav.Link>
                    )}
                </Nav>
            </Navbar.Collapse>

            <AuthSection />
        </Navbar>
    );
};

export default NavMenu;
