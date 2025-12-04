import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';


import AuthSection from '../auth/AuthSection';

const NavMenu: React.FC = () => {
    return (
        <Navbar expand="lg" bg="white" className="shadow-sm sticky-top py-3">
            <Container> 
                <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">HealthApp</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/bookings">Bookings</Nav.Link>
                        <Nav.Link as={Link} to="/availableDays">AvailableDays</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                <AuthSection />
            </Container> 
        </Navbar>

        
    );
};

export default NavMenu;