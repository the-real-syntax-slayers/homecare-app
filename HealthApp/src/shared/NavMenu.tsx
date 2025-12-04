import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';

import AuthSection from '../auth/AuthSection';
import { useAuth } from '../auth/AuthContext';

const NavMenu: React.FC = () => {
    const { user } = useAuth();

    const getRoleColor = () => {
        if (!user) return "transparent";
        switch (user.role) {
            case "Admin": return "#d9534f";   // Red
            case "Employee": return "#0275d8"; // Blue
            default: return "#5cb85c";        // Green (Patient or fallback)
        }
    };

    return (
        <Navbar expand="lg" bg="white" className="shadow-sm sticky-top py-3">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
                    HealthApp
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/bookings">Bookings</Nav.Link>
                        <Nav.Link as={Link} to="/availableDays">AvailableDays</Nav.Link>
                    </Nav>

                    {/* Role badge */}
                    {user && (
                        <span
                            style={{
                                padding: "6px 12px",
                                borderRadius: "8px",
                                fontWeight: "bold",
                                color: "white",
                                backgroundColor: getRoleColor(),
                                marginRight: "12px"
                            }}
                        >
                            {user.role}
                        </span>
                    )}

                    <AuthSection />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavMenu;