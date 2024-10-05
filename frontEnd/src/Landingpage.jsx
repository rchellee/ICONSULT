import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./index.css"; // Make sure to include your CSS file for custom styling
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();
  return (
    <div>
      {/* Header & Navbar */}
      <header className="bg-dark fixed-top">
        <nav className="container-xxl navbar navbar-expand-lg py-3 bg-dark navbar-dark">
          <div className="container-fluid">
            <a className="navbar-brand fw-bold fs-3" href="#">
              James Anderson
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item mx-2">
                  <a className="nav-link" href="#skills">
                    Services
                  </a>
                </li>
                <li className="nav-item mx-2">
                  <a className="nav-link" href="#portfolio">
                    PORTFOLIO
                  </a>
                </li>
                <li className="nav-item mx-2">
                  <a className="nav-link" href="#about">
                    ABOUT
                  </a>
                </li>
                <li className="nav-item mx-2">
                  <a className="nav-link" href="#cv">
                    CURRICULUM VITAE
                  </a>
                </li>
                <li className="nav-item mx-2">
                  <a className="nav-link" href="#contact">
                    CONTACT
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero d-flex flex-column align-items-center justify-content-center">
        <div className="text-center">
          <h1 className="h1 text-white fw-medium fst-italic">James Anderson</h1>
          <h2 className="display-3 text-white fw-bold">
            Information & Computer Systems <br /> student
          </h2>
          <button className="btn btn-lg fs-6 fw-medium mt-5 btn-primary p-3" onClick={() => navigate("/login")}>
            LOGIN NOW
          </button>
        </div>
      </section>

      {/* Skills Section */}
      <section className="container py-5" id="about">
        <div className="row mt-4 py-3">
          <div className="col-12 text-center">
            <h2>About</h2>
            <h5 className="text-secondary fw-normal py-2 fst-italic">
              Continuously improving my skills and knowledge in the field.
            </h5>
          </div>
        </div>
        <div className="row d-flex justify-content-between mx-0">
          <SkillCard
            icon="fa-cart-shopping"
            title="Front-end Development"
            description="Proficient in HTML, CSS, and JavaScript. Experienced in responsive web design, building user-friendly interfaces, and using modern frameworks like ReactJS."
          />
          <SkillCard
            icon="fa-laptop"
            title="Back-end Development"
            description="Skilled in server-side programming using technologies like Node.js and Express. Experience working with databases such as MongoDB and MySQL."
          />
          <SkillCard
            icon="fa-mobile-screen-button"
            title="Mobile App Development"
            description="Proficient in developing mobile apps for iOS and Android using frameworks like React Native. Experienced in building engaging and intuitive mobile user interfaces."
          />
        </div>
      </section>

      {/* More sections like Portfolio, About, etc. */}
    </div>
  );
};

// SkillCard Component to reuse in the skills section
const SkillCard = ({ icon, title, description }) => {
  return (
    <div className="card mt-5 d-flex flex-column align-items-center text-center bg-white p-4" style={{ width: "25rem" }}>
      <i className={`text-white bg-primary d-flex align-items-center justify-content-center fs-2 rounded-circle fa-solid ${icon}`}></i>
      <h3 className="mt-4 h4">{title}</h3>
      <p className="text-center">{description}</p>
    </div>
  );
};

export default LandingPage;