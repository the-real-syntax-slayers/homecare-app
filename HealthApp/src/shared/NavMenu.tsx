import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';


import AuthSection from '../auth/AuthSection';

const NavMenu: React.FC = () => {
    return (
        <Navbar expand="lg">
            <Navbar.Brand href="/">HealthApp</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/bookings">Bookings</Nav.Link>
                    <Nav.Link as={Link} to="/availableDays">AvailableDays</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            <AuthSection />
        </Navbar>

        
    );
};

export default NavMenu;