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
<<<<<<< Updated upstream
    </div>
=======

      {/* Skills Section */}
      <section className="skills" id="skills">
        <div className="content">
          <div className="title">
            <span>Our Skills</span>
          </div>
          <div className="skills-details">
            <div className="text">
              <div className="topic">Skills Reflects Our Knowledge</div>
              <p>
                At iConsult, our team is equipped with a robust combination of
                expertise in accounting, financial management, and business
                consultancy. With years of hands-on experience across diverse
                industries, we bring a deep understanding of operational
                challenges and innovative solutions to the table. Our mission is
                to empower businesses through exceptional service and
                data-driven insights.
              </p>
              <div className="experience">
                <div className="num">9</div>
                <div className="exp">
                  Years Of <br /> Service
                </div>
              </div>
            </div>
            <div className="boxes">
              <div className="box">
                <div className="topic">Certified Public Accountant</div>
                <div className="per">CPA</div>
              </div>
              <div className="box">
                <div className="topic">
                  Finance Manager at DMCM Capital Corporate Services Inc
                </div>
                <div className="per">4 yrs</div>
              </div>
              <div className="box">
                <div className="topic">
                  Assistant Manager for Accounting/Accounting Supervisor/Auditor
                </div>
                <div className="per">2 yrs  </div>
              </div>
              <div className="box">
                <div className="topic">
                  Audit Associate at Diaz Murillo Dalupan and Company CPAs
                </div>
                <div className="per">1 yr </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services" id="services">
        <div className="content">
          <div className="title">
            <span>Our Services</span>
          </div>
          <div className="boxes">
            <div className="box">
              <div className="icon">
                <i className="fas fa-desktop"></i>
              </div>
              <div className="topic">Corporate and Consultancy Services</div>
              <p>
                Providing strategic guidance to organizations to streamline
                their operations, enhance profitability, and align business
                goals with sustainable practices.
              </p>
            </div>
            <div className="box">
              <div className="icon">
                <i className="fas fa-paint-brush"></i>
              </div>
              <div className="topic">Management Advisory Services</div>
              <p>
                Offering expert advice on leadership, organizational
                development, and change management to drive efficiency and
                innovation.
              </p>
            </div>
            <div className="box">
              <div className="icon">
                <i className="fas fa-desktop"></i>
              </div>
              <div className="topic"> Professional Services</div>
              <p>
                Delivering specialized services such as accounting, legal, and
                compliance support tailored to your business needs.
              </p>
            </div>
            <div className="box">
              <div className="icon">
                <i className="fas fa-paint-brush"></i>
              </div>
              <div className="topic">Payroll Services</div>
              <p>
                Ensuring accurate and timely payroll management, tax compliance,
                and employee benefits administration.
              </p>
            </div>
            <div className="box">
              <div className="icon">
                <i className="fas fa-desktop"></i>
              </div>
              <div className="topic">Registrations</div>
              <p>
                Assisting with business registrations, licensing, and
                certifications to ensure compliance with local and international
                regulations.
              </p>
            </div>
            <div className="box">
              <div className="icon">
                <i className="fas fa-paint-brush"></i>
              </div>
              <div className="topic">Other Related Matters</div>
              <p>
                Providing end-to-end support for unique business challenges,
                ensuring comprehensive and effective solutions.
              </p>
            </div>{" "}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <div className="content">
          <div className="title">
            <span>Contact Us</span>
          </div>
          <div className="text">
            <div className="topic">Have Any Project?</div>
            <p>Contact Us sharpmindsbc@gmail.com || 0917 137 0636.</p>
            <div className="button">
              <button>
                <a href="#home">Start Working With Us!</a>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="text">
          <span>
            Created By{" "}
            <a href="#">
              iConsult Team Bautista, Cabigting, Rueras, Sandiego 2025
            </a>{" "}
            | &#169; 2025 All Rights Reserved
          </span>
        </div>
      </footer>
    </>
>>>>>>> Stashed changes
  );
};

export default LandingPage;
