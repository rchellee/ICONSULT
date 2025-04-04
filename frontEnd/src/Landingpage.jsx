import React, { useEffect } from "react";
import "./Landing.css";
import logo from "./assets/about.png";
import logo4 from "./assets/logo4.png";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const nav = document.querySelector("nav");
    const scrollBtn = document.querySelector(".scroll-button a");
    const body = document.querySelector("body");
    const navBar = document.querySelector(".navbar");
    const menuBtn = document.querySelector(".menu-btn");
    const cancelBtn = document.querySelector(".cancel-btn");
    const navLinks = document.querySelectorAll(".menu li a");

    const handleScroll = () => {
      if (document.documentElement.scrollTop > 20) {
        nav.classList.add("sticky");
        scrollBtn.style.display = "block";
      } else {
        nav.classList.remove("sticky");
        scrollBtn.style.display = "none";
      }
    };

    const openMenu = () => {
      navBar.classList.add("active");
      menuBtn.style.opacity = "0";
      menuBtn.style.pointerEvents = "none";
      body.style.overflow = "hidden";
      scrollBtn.style.pointerEvents = "none";
    };

    const closeMenu = () => {
      navBar.classList.remove("active");
      menuBtn.style.opacity = "1";
      menuBtn.style.pointerEvents = "auto";
      body.style.overflow = "auto";
      scrollBtn.style.pointerEvents = "auto";
    };

    menuBtn.addEventListener("click", openMenu);
    cancelBtn.addEventListener("click", closeMenu);
    navLinks.forEach((link) => link.addEventListener("click", closeMenu));
    window.addEventListener("scroll", handleScroll);

    return () => {
      menuBtn.removeEventListener("click", openMenu);
      cancelBtn.removeEventListener("click", closeMenu);
      navLinks.forEach((link) => link.removeEventListener("click", closeMenu));
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Move to up button */}
      <div className="scroll-button">
        <a href="#home">
          <i className="fas fa-arrow-up"></i>
        </a>
      </div>

      {/* Navigation menu */}
      <nav>
        <div className="navbar">
          <div className="logo">
            <div className="logo">
              <a href="#">
                <img
                  src={logo4}
                  alt="iConsult Logo"
                  style={{
                    height: "50px", // Adjust as needed
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
              </a>
            </div>
          </div>
          <ul className="menu">
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#skills">Skills</a>
            </li>
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
            <div className="cancel-btn">
              <i className="fas fa-times"></i>
            </div>
          </ul>
          <div className="media-icons">
            <a
              href="https://www.facebook.com/sharpmindsbci"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://linkedin.com/in/maria-lourdes-ignacio-cpa-6812a2137"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-linkedin"></i>
            </a>
            <a
              href="https://www.facebook.com/sharpmindsbci"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
        <div className="menu-btn">
          <i className="fas fa-bars"></i>
        </div>
      </nav>

      {/* Home Section */}
      <section className="home" id="home">
        <div className="home-content">
          <div className="text">
            <div className="text-one">Welcome to,</div>
            <div className="text-two">iConsult</div>
            <div className="text-three">Organize. Collaborate. Deliver.</div>
          </div>
          <div className="button-landing">
            <button onClick={() => navigate("/login")}>LOGIN NOW</button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="content">
          <div className="title">
            <span>About Us</span>
          </div>
          <div className="about-details">
            <div className="left">
              <img src={logo} alt="About" />
            </div>
            <div className="right">
              <div className="topic">Get Free Business Consultation</div>
              <p>
                Sharp Minds is a dynamic and innovative firm specializing in
                providing comprehensive business consultancy services to
                organizations across various industries. The company is
                committed to helping businesses navigate challenges, improve
                operational efficiency, and achieve sustainable growth through
                tailored strategies and expert guidance.
              </p>
              <p>
                iConsult is a leading business consultancy firm integrated with
                a comprehensive project management system. Our mission is to
                empower organizations with tailored strategies that align
                business goals with operational excellence. Through our
                platform, clients can seamlessly manage projects, track
                progress, and access expert consultancy services designed to
                drive growth and innovation.
              </p>
              <div className="button">
                <button>Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                <div className="per">2 yrs </div>
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
  );
};

export default LandingPage;
