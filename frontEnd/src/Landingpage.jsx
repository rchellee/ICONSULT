import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faBriefcase, faClipboard, faCog, faMoneyCheckAlt, faBuilding, faFileAlt, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
import './Landing.css'; 
import logo from './assets/logo2.png'; 
import pic1 from './assets/pic1.png';
import pic3 from './assets/pic3.png'; 
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <header className="header">
        <nav className="navbar">
          <div className="logo">
            <img src={logo} alt="Logo" className="logo-img" />
          </div>
          <div className="nav-links">
            <a href="#home" className="nav-link">Home</a>
            <a href="#services" className="nav-link">Services</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>
        </nav>
      </header>
      
      <section id="home" className="hero">
        <div className="hero-content">
          <div className='i-left'>
            <div className='i-name'>
              <div>Welcome to iConsult</div>
              <div>Connect and start your productivity</div>
            </div>
            <button className="login-btn" onClick={() => navigate("/login")}>
              LOGIN NOW
            </button>
          </div>
          <div className='i-right'>
            <img src={pic1} alt="" />
          </div>
        </div>
      </section>

      <section id="services" className="services">
        <h2>Our <span className="services-text">Services</span></h2>
        <span className="choose-us-text">Why People Choose Us</span>
        <div className="swipe-box-container">
          <div className="swipe-boxes">
            <div className="swipe-box">
              <FontAwesomeIcon icon={faBriefcase} className="swipe-icon" /> {/* Icon */}
              Corporate and Consultancy Services
            </div>
            <div className="swipe-box">
              <FontAwesomeIcon icon={faClipboard} className="swipe-icon" /> {/* Icon */}
              Management Advisory Services
            </div>
            <div className="swipe-box">
              <FontAwesomeIcon icon={faCog} className="swipe-icon" /> {/* Icon */}
              Professional Services
            </div>
            <div className="swipe-box">
              <FontAwesomeIcon icon={faMoneyCheckAlt} className="swipe-icon" /> {/* Icon */}
              Payroll Services
            </div>
            <div className="swipe-box">
              <FontAwesomeIcon icon={faBuilding} className="swipe-icon" /> {/* Icon */}
              Business Set-up
            </div>
            <div className="swipe-box">
              <FontAwesomeIcon icon={faFileAlt} className="swipe-icon" /> {/* Icon */}
              Registrations
            </div>
            <div className="swipe-box">
              <FontAwesomeIcon icon={faQuestionCircle} className="swipe-icon" /> {/* Icon */}
              Other Related Matters
            </div>
          </div>
          <div className="swipe-buttons">
            <button className="scroll-btn prev-btn">❮</button>
            <button className="scroll-btn next-btn">❯</button>
          </div>
        </div>
        {/* Add pic3 image here */}
        <div className="pic-container">
          <img src={pic3} alt="pic3" className="pic3-img" />
          <div className="pic3-text">
            <h2>Get Free Business Consultation</h2>
            <p>
              At iConsult, we provide complimentary business consultation to help you make informed decisions and unlock your business’s full potential. Whether you're starting out or looking to scale, our expert team is here to guide you every step of the way.
            </p>
                {/* Add the Learn More button here */}
    <button className="learn-more-btn">Learn More</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
