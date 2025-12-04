import React from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import AuthSection from '../auth/AuthSection';

const NavMenu: React.FC = () => {
    return (
        <Navbar expand="lg">
            <Navbar.Brand href="/">HealthApp</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/bookings">Bookings</Nav.Link>
                    <Nav.Link href="/availableDays">AvailableDays</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            <AuthSection />
        </Navbar>
    );
};

export default NavMenu;