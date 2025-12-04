import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

import './HomePageStyle.css';

const API_URL = import.meta.env.VITE_API_URL;

const HomePage: React.FC = () => {
    return (
        <main>
            {/* Hero Section */}
            <section className="hero-section bg-white">
                <Container className="text-center">
                        <h1 className="display-4 fw-bold mb-3">Quality Home Care You Can Trust.</h1>
                        <p className="lead mb-4">Welcome to HomeAssist. We provide compassionate and reliable in-home care for your elderly loved ones. Book and manage appointments with ease.</p>
                        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                            <Link to="/bookings" className="btn btn-primary btn-lg rounded-pill">
                                Book an Appointment
                            </Link>
                            
                            <Link to="/login" className="btn btn-light btn-lg rounded-pill">
                                Log In
                            </Link>
                        </div>
                </Container>
            </section>

            {/* Services Section */}
            <section id="services" className="services-section">
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="h2 fw-bold mb-3">Our Services</h2>
                    </div>

                    <Row className="g-4">
                        <Col xs={12} sm={6} lg={4}>
                            <div className="card text-center shadow-sm h-100">
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">Personal Care</h5>
                                    <p className="card-text">Help with bathing, dressing, and daily routines.</p>
                                </div>
                            </div>
                        </Col>

                        <Col xs={12} sm={6} lg={4}>
                            <div className="card text-center shadow-sm h-100">
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">Companionship</h5>
                                    <p className="card-text">Friendly visits, conversation, and engaging activities.</p>
                                </div>
                            </div>
                        </Col>

                        <Col xs={12} sm={6} lg={4}>
                            <div className="card text-center shadow-sm h-100">
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">Meal Prep</h5>
                                    <p className="card-text">Nutritious cooking and grocery shopping.</p>
                                </div>
                            </div>
                        </Col>

                        <Col xs={12} sm={6} lg={4}>
                            <div className="card text-center shadow-sm h-100">
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">Errands</h5>
                                    <p className="card-text">Help with prescription pickups, mail, and other tasks.</p>
                                </div>
                            </div>
                        </Col>

                        <Col xs={12} sm={6} lg={4}>
                            <div className="card text-center shadow-sm h-100">
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">Light Housekeeping</h5>
                                    <p className="card-text">Tidying up, laundry, and keeping the home safe and clean.</p>
                                </div>
                            </div>
                        </Col>

                        <Col xs={12} sm={6} lg={4}>
                            <div className="card text-center shadow-sm h-100">
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">Medication Reminders</h5>
                                    <p className="card-text">Ensuring medications are taken safely and on schedule.</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="how-it-works-section bg-white">
                <Container className="text-center">
                        <h2 className="h2 fw-bold mb-3">Our Simple Process</h2>
                        <p className="lead mb-5">We make getting started with quality care as easy as 1-2-3.</p>

                    <Row className="justify-content-center">
                        <Col md={10} lg={8}>
                        <div className="process-step">
                            <div className="process-number">1</div>
                            <div className="process-content mb-5">
                                <h5 className="fw-bold">Set up your account</h5>
                                <p>Create your account in just a few minutes to get started.</p>
                            </div>
                        </div>
                        <div className="process-step">
                            <div className="process-number">2</div>
                            <div className="process-content mb-5">
                                <h5 className="fw-bold">Book an Appointment</h5>
                                <p>Select a time that works for you and choose the services you need right from our app.</p>
                            </div>
                        </div>
                        <div className="process-step">
                            <div className="process-number">3</div>
                            <div className="process-content mb-5">
                                <h5 className="fw-bold">Meet Your Caregiver</h5>
                                <p>A friendly, qualified caregiver will arrive at your home for the scheduled appointment.</p>
                            </div>
                        </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* CTA Section */}
            <section id="book" className="cta-section text-white text-center">
                <Container>
                    <h2 className="h2 fw-bold mb-3">Ready to Get Started?</h2>
                    <p className="lead mb-4">Give yourself or your loved ones the care and comfort they deserve.</p>
                    <Link to="/register" className="btn btn-light btn-lg text-primary">
                        Register
                    </Link>
                </Container>
            </section>
        </main>
    );
};

export default HomePage;