import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./EditProfile.css";

const EditProfile = ({ clientDetails }) => {
  const [formData, setFormData] = useState({
    firstName: clientDetails?.firstName || "",
    middleInitial: clientDetails?.middleInitial || "",
    lastName: clientDetails?.lastName || "",
    email: clientDetails?.email_add || "",
    phone: clientDetails?.mobile_number || "",
    address: clientDetails?.address || "",
  });

  const [message, setMessage] = useState("");
  const history = useHistory();

  useEffect(() => {
    const handleEscKeyPress = (event) => {
      if (event.key === "Escape") {
        history.push("/account-settings");
      }
    };

    window.addEventListener("keydown", handleEscKeyPress);
    return () => {
      window.removeEventListener("keydown", handleEscKeyPress);
    };
  }, [history]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setMessage("Please fill in all required fields.");
      return;
    }

    // Here, you would typically make an API call to save the updated details
    setMessage("Profile updated successfully!");
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Middle Initial</label>
          <input
            type="text"
            name="middleInitial"
            value={formData.middleInitial}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Save Changes</button>
      </form>

      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default EditProfile;
