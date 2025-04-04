import React, { useState } from "react";
import "./UpdateProfileForm.css";

const UpdateProfileForm = ({
  clientDetails,
  handleCloseForm,
  onUpdateSuccess,
}) => {
  const [formData, setFormData] = useState({
    firstName: clientDetails.firstName || "",
    lastName: clientDetails.lastName || "",
    mobile_number: clientDetails.mobile_number || "",
    email_add: clientDetails.email_add || "",
    companyName: clientDetails.companyName || "",
    address: clientDetails.address || "",
    companyContact: clientDetails.companyContact || "",
    companyPosition: clientDetails.companyPosition || "",
    gender: clientDetails.gender || "male",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      gender: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8081/client/${clientDetails.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      onUpdateSuccess(); // Just call without passing data since we'll refetch
      handleCloseForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-profile">
      <header>Update Profile</header>
      <form className="form-profile" onSubmit={handleSubmit}>
        {/* Basic Information Section */}
        <div className="column-profile">
          <div className="input-box-profile">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-box-profile">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-box-profile">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              defaultValue={clientDetails.username}
              readOnly
              className="read-only"
            />
          </div>
        </div>
        <div className="column-profile">
          <div className="input-box-profile">
            <label>Email Address</label>
            <input
              type="email"
              name="email_add"
              placeholder="Enter email address"
              value={formData.email_add}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-box-profile address">
            <label>Home Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter street address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="column-profile">
          <div className="input-box-profile">
            <label>Nationality</label>
            <input
              type="text"
              placeholder="Enter nationality"
              defaultValue={clientDetails.nationality}
              readOnly
              className="read-only"
            />
          </div>
        </div>
        <div className="column-profile">
          <div className="input-box-profile">
            <label>Age</label>
            <input
              type="number"
              placeholder="Enter age"
              defaultValue={clientDetails.age}
              readOnly
              className="read-only"
            />
          </div>
          <div className="gender-box-profile">
            <h3>Gender</h3>
            <div className="gender-option-profile">
              <div className="gender-profile">
                <input
                  type="radio"
                  id="check-male"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleRadioChange}
                />
                <label htmlFor="check-male">Male</label>
              </div>
              <div className="gender-profile">
                <input
                  type="radio"
                  id="check-female"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleRadioChange}
                />
                <label htmlFor="check-female">Female</label>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="input-box-profile">
            <label>Phone Number</label>
            <input
              type="text"
              name="mobile_number"
              placeholder="Enter phone number"
              value={formData.mobile_number}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="column-profile">
          {/* Company Information Section */}
          <div className="input-box-profile">
            <label>Company Name</label>
            <input
              type="text"
              name="companyName"
              placeholder="Enter company name"
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>
          <div className="input-box-profile">
            <label>Position</label>
            <input
              type="text"
              name="companyPosition"
              placeholder="Enter position"
              value={formData.companyPosition}
              onChange={handleChange}
            />
          </div>
          <div className="input-box-profile">
            <label>Company Number</label>
            <input
              type="text"
              name="companyContact"
              placeholder="Enter company number"
              value={formData.companyContact}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Error message */}
        {error && <div className="error-message">{error}</div>}

        {/* Buttons */}
        <div className="form-buttons">
          <button
            type="button"
            className="cancel-button"
            onClick={handleCloseForm}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfileForm;
