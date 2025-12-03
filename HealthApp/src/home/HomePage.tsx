// src/home/HomePage.tsx

import React from 'react';
import { Container } from 'react-bootstrap';

const HomePage: React.FC = () => {
    return (
        <Container className="mt-4">
            <h1>Welcome to HomeCare</h1>
            <p>
                This app helps homecare staff and clients manage appointments.
            </p>
            <ul>
                <li>
                    <strong>Healthcare personnel</strong> create and manage <em>available days</em>.
                </li>
                <li>
                    <strong>Clients</strong> create and manage their own <em>bookings</em> within those days.
                </li>
                <li>
                    <strong>Admin</strong> can do everything.
                </li>
            </ul>
            <p>
                Use the navigation bar at the top to go to <strong>Available days</strong> or <strong>Bookings</strong>.
            </p>
        </Container>
    );
};

export default HomePage;
