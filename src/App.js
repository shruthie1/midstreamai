import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomNavbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Products from './components/Products';
import Testimonials from './components/Testimonials';
import CaseStudies from './components/CaseStudies';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ContactUs from './components/ContactUs';

function App() {
    return (
        <Router>
            <div className="App">
                {/* <div>
                    <a href="/">
                        <img src="/logo.png" alt="MidstreamAI Logo" className="logo" />
                    </a>
                </div> */}
                <CustomNavbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/testimonials" element={<Testimonials />} />
                    <Route path="/casestudies" element={<CaseStudies />} />
                    <Route path="/contact" element={<ContactUs />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
