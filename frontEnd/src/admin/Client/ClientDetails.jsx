import React, { useState } from "react";
import './client.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ClientDetails = ({ client, goBack, updateClient }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...client });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8081/client/${client.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedClient = await response.json();
        updateClient(updatedClient);
        setIsEditing(false);
      } else {
        console.error("Error updating client:", await response.text());
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        const response = await fetch(`http://localhost:8081/client/${client.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Client deleted successfully");
          goBack();
        } else {
          console.error("Error deleting client:", await response.text());
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  };


  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="client-details">
      <div className="tabs">
        <button className={activeTab === "overview" ? "active" : ""} onClick={() => handleTabClick("overview")}>Overview</button>
        <button className={activeTab === "appointments" ? "active" : ""} onClick={() => handleTabClick("appointments")}>Appointments</button>
        <button className={activeTab === "projects" ? "active" : ""} onClick={() => handleTabClick("projects")}>Projects</button>
        <button className={activeTab === "files" ? "active" : ""} onClick={() => handleTabClick("files")}>Files</button>
      </div>

      <div className="client-info">
        {activeTab === "overview" && (
          <>
            {isEditing ? (
              <form onSubmit={handleSave} className="overview-form-grid">
                {/* Name Section */}
                <div className="row">
                  <div className="input-group input-group-icon">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      required
                    />
                    <div className="input-icon"><i className="fa fa-user"></i></div>
                  </div>
                  <div className="input-group input-group-icon">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      required
                    />
                    <div className="input-icon"><i className="fa fa-user"></i></div>
                  </div>
                  <div className="input-group input-group-icon">
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="Mobile Number"
                    />
                    <div className="input-icon"><i className="fa fa-phone"></i></div>
                  </div>
                  <div className="input-group input-group-icon">
                      <input
                          type="text"
                          name="companyContact"
                          placeholder="Company Contact Number"
                          value={formData.companyContact || ""}
                          onChange={handleChange}
                      />
                      <div className="input-icon"><i className="fa fa-phone"></i></div>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="row">
                  <div className="input-group input-group-icon">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      required
                    />
                    <div className="input-icon"><i className="fa fa-envelope"></i></div>
                  </div>
                  <div className="input-group input-group-icon">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Address"
                    />
                    <div className="input-icon"><i className="fa fa-map-marker-alt"></i></div>
                    </div>
                    <div className="input-group input-group-icon">
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Company Name"
                    />
                    <div className="input-icon"><i className="fa fa-building"></i></div>    
                  </div>
                  <div className="input-group input-group-icon">
                    <input
                      type="text"
                      name="positionInCompany"
                      value={formData.positionInCompany}
                      onChange={handleChange}
                      placeholder="Position in Company"
                    />
                    <div className="input-icon"><i className="fa fa-briefcase"></i></div>
                  </div>
                </div>
                {/* Save and Cancel Buttons */}
                <div className="button-group">
                  <button type="submit" className="btn-save"><i className="fas fa-save"></i> Save Changes</button>
                  <button type="button" className="btn-cancel" onClick={toggleEdit}><i className="fas fa-times"></i> Cancel</button>
                </div>
              </form>
               ) : (
              <div className="client-readonly grid">
                <p><i className="fas fa-user"></i> <strong>First Name:</strong> {client.firstName}</p>
                <p><i className="fas fa-user"></i> <strong>Last Name:</strong> {client.lastName}</p>
                <p><i className="fas fa-envelope"></i> <strong>Email Address:</strong> {client.email}</p>
                <p><i className="fas fa-briefcase"></i> <strong>Occupation:</strong> {client.occupation}</p>
                <p><i className="fas fa-flag"></i> <strong>Nationality:</strong> {client.nationality}</p>
                <p><i className="fas fa-phone"></i> <strong>Mobile Number:</strong> {client.mobileNumber}</p>
                <p><i className="fas fa-map-marker-alt"></i> <strong>Address:</strong> {client.address}</p>
                <p><i className="fas fa-city"></i> <strong>City:</strong> {client.city}</p>
                <p><i className="fas fa-mail-bulk"></i> <strong>Postal Code:</strong> {client.postalCode}</p>
                <p><i className="fas fa-building"></i> <strong>Company Name:</strong> {client.companyName}</p>
                <p><i className="fas fa-user-tie"></i> <strong>Position in Company:</strong> {client.positionInCompany}</p>
                <p><i className="fas fa-phone-alt"></i> <strong>Company Number:</strong> {client.companyContactNumber}</p>
                <p><i className="fas fa-calendar"></i> <strong>Birthdate:</strong> {client.birthdate}</p>
                <p><i className="fas fa-venus-mars"></i> <strong>Gender:</strong> {client.gender}</p>

                <div className="button-group">
                <button className="btn-edit" onClick={toggleEdit}> <i className="fas fa-edit"></i>Edit</button>
                <button className="btn-back" onClick={goBack}><i className="fas fa-arrow-left"></i>Back</button>
                <button className="btn-delete" onClick={handleDelete}><i className="fas fa-trash"></i> Delete</button>
                </div>
              </div>
            )}
          </>
        )}
        {activeTab === "appointments" && <div>Appointments Content</div>}
        {activeTab === "projects" && <div>Projects Content</div>}
        {activeTab === "files" && <div>Files Content</div>}
      </div>
    </div>
  );
};

export default ClientDetails;
