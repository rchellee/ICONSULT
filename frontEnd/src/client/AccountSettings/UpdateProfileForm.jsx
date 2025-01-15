import './UpdateProfileForm.css';
import React, { useState, useEffect } from "react";


const UpdateProfileForm = ({ clientDetails, handleCloseForm }) => {
  return (
    <div className="update-profile-form">
      <form>
        {/* Basic Information Section */}
        <div className="form-update-section">
          <h3>Basic Information</h3>
          <div className="form-update-group">
            <div>
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" defaultValue={clientDetails.firstName} />
            </div>
            <div>
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" defaultValue={clientDetails.lastName} />
            </div>
            <div>
              <label htmlFor="username">Username</label>
              <input type="text" id="username" defaultValue={clientDetails.username} />
            </div>
          </div>
          <div className="form-update-group">
            <div>
              <label htmlFor="age">Age</label>
              <input type="number" id="age" defaultValue={clientDetails.age} />
            </div>
            <div>
              <label htmlFor="gender">Gender</label>
              <input type="text" id="gender" defaultValue={clientDetails.gender} />
            </div>
            <div>
              <label htmlFor="nationality">Nationality</label>
              <input type="text" id="nationality" defaultValue={clientDetails.nationality} />
            </div>
          </div>
          <div className="form-update-group">
            <div>
              <label htmlFor="home">Home</label>
              <input type="text" id="home" defaultValue={clientDetails.home} />
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="form-section">
          <h3>Contact Information</h3>
          <div className="form-contact-group">
            <div className="contact-item">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input type="text" id="phoneNumber" defaultValue={clientDetails.phoneNumber} />
            </div>
            <div className="contact-item">
              <label htmlFor="emailAddress">Email Address</label>
              <input type="email" id="emailAddress" defaultValue={clientDetails.emailAddress} />
            </div>
          </div>
        </div>

        {/* Company Information Section */}
        <div className="form-company-section">
          <h3>Company</h3>
          <div className="form-one">
            <label htmlFor="companyName">Company Name</label>
            <input type="text" id="companyName" defaultValue={clientDetails.companyName} />
          </div>
          <div className="form-group">
            <div className="company-item">
              <label htmlFor="position">Position</label>
              <input type="text" id="position" defaultValue={clientDetails.position} />
            </div>
            <div className="company-item">
              <label htmlFor="companyNumber">Company Number</label>
              <input type="text" id="companyNumber" defaultValue={clientDetails.companyNumber} />
            </div>
          </div>
        </div>

        {/* Save Changes and Cancel Buttons */}
        <div className="form-update-group">
        <button type="button" className="cancel-profile-btn" onClick={handleCloseForm}>
            Cancel
          </button>
          <button type="submit" className="submit-profile-btn">Save</button>
          
        </div>
      </form>
    </div>
  );
};

export default UpdateProfileForm;
