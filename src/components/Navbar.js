import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './Navbar.css';

function CustomNavbar() {
    return (
        <Navbar bg="light" expand="lg" className="custom-navbar">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <LinkContainer to="/">
                        <Nav.Link>Home</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/about">
                        <Nav.Link>About</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/services">
                        <Nav.Link>Services</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/products">
                        <Nav.Link>Products</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/testimonials">
                        <Nav.Link>Testimonials</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/casestudies">
                        <Nav.Link>Case Studies</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/partners">
                        <Nav.Link>Partners</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/contact">
                        <Nav.Link>Contact us</Nav.Link>
                    </LinkContainer>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default CustomNavbar;
