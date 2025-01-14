import React, { useState, useEffect } from "react";
import "./client-admin.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const ClientDetails = ({
  client,
  showToast,
  hideToast,
  goBack,
  updateClient,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...client });
  const [appointments, setAppointments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/appointmentsdetails/${client.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        } else {
          console.error("Failed to fetch appointments");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/project/${client.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          console.error("Failed to fetch projects");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    const fetchUploads = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/upload/${client.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setFiles(data);
        } else {
          console.error("Failed to fetch upload");
        }
      } catch (error) {
        console.error("Error fetching upload:", error);
      }
    };

    fetchAppointments();
    fetchProjects();
    fetchUploads();
  }, [client.id]);

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
      const response = await fetch(
        `http://localhost:8081/client/${client.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const updatedClient = await response.json();
        showToast();
        setIsEditing(false);
        goBack();
        updateClient(updatedClient);
        hideToast();
      } else {
        console.error("Error updating client:", await response.text());
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="client-details">
      <div className="tabs">
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => handleTabClick("overview")}
        >
          Overview
        </button>
        <button
          className={activeTab === "appointments" ? "active" : ""}
          onClick={() => handleTabClick("appointments")}
        >
          Appointments
        </button>
        <button
          className={activeTab === "projects" ? "active" : ""}
          onClick={() => handleTabClick("projects")}
        >
          Projects
        </button>
        <button
          className={activeTab === "files" ? "active" : ""}
          onClick={() => handleTabClick("files")}
        >
          Files
        </button>
      </div>

      <div className="client-info">
        {activeTab === "overview" && (
          <>
            {isEditing ? (
              <form onSubmit={handleSave} className="overview-form-grid">
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
                    <div className="input-icon">
                      <i className="fa fa-user"></i>
                    </div>
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
                    <div className="input-icon">
                      <i className="fa fa-user"></i>
                    </div>
                  </div>
                  <div className="input-group input-group-icon">
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobile_number}
                      onChange={handleChange}
                      placeholder="Mobile Number"
                    />
                    <div className="input-icon">
                      <i className="fa fa-phone"></i>
                    </div>
                  </div>
                  <div className="input-group input-group-icon">
                    <input
                      type="text"
                      name="companyContact"
                      placeholder="Company Contact Number"
                      value={formData.companyContact || ""}
                      onChange={handleChange}
                    />
                    <div className="input-icon">
                      <i className="fa fa-phone"></i>
                    </div>
                  </div>
                </div>
                {/* Contact Section */}
                <div className="row">
                  <div className="input-group input-group-icon">
                    <input
                      type="email"
                      name="email"
                      value={formData.email_add}
                      onChange={handleChange}
                      placeholder="Email Address"
                      required
                    />
                    <div className="input-icon">
                      <i className="fa fa-envelope"></i>
                    </div>
                  </div>
                  <div className="input-group input-group-icon">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Address"
                    />
                    <div className="input-icon">
                      <i className="fa fa-map-marker-alt"></i>
                    </div>
                  </div>
                  <div className="input-group input-group-icon">
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Company Name"
                    />
                    <div className="input-icon">
                      <i className="fa fa-building"></i>
                    </div>
                  </div>
                  <div className="input-group input-group-icon">
                    <input
                      type="text"
                      name="companyPosition"
                      value={formData.companyPosition}
                      onChange={handleChange}
                      placeholder="Position in Company"
                    />

                    <div className="input-icon">
                      <i className="fa fa-briefcase"></i>
                    </div>
                  </div>
                </div>
                {/* Save and Cancel Buttons */}
                <div className="button-group">
                  <button type="submit" className="btn-save">
                    <i className="fas fa-save"></i> Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={toggleEdit}
                  >
                    <i className="fas fa-times"></i> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="client-readonly grid">
                <p>
                  <i className="fas fa-user"></i> <strong>First Name:</strong>{" "}
                  {client.firstName}
                </p>
                <p>
                  <i className="fas fa-user"></i> <strong>Last Name:</strong>{" "}
                  {client.lastName}
                </p>
                <p>
                  <i className="fas fa-envelope"></i>{" "}
                  <strong>Email Address:</strong> {client.email_add}
                </p>
                <p>
                  <i className="fa fa-calendar"></i>
                  <strong>Age:</strong> {client.age}
                </p>
                <p>
                  <i className="fas fa-flag"></i> <strong>Nationality:</strong>{" "}
                  {client.nationality}
                </p>
                <p>
                  <i className="fas fa-phone"></i>{" "}
                  <strong>Mobile Number:</strong> {client.mobile_number}
                </p>
                <p>
                  <i className="fas fa-map-marker-alt"></i>{" "}
                  <strong>Address:</strong> {client.address}
                </p>
                <p>
                  <i className="fas fa-city"></i> <strong>City:</strong>{" "}
                  {client.city}
                </p>
                <p>
                  <i className="fas fa-mail-bulk"></i>{" "}
                  <strong>Postal Code:</strong> {client.postalCode}
                </p>
                <p>
                  <i className="fas fa-building"></i>{" "}
                  <strong>Company Name:</strong> {client.companyName}
                </p>
                <p>
                  <i className="fas fa-user-tie"></i>{" "}
                  <strong>Position in Company:</strong> {client.companyPosition}
                </p>
                <p>
                  <i className="fas fa-phone-alt"></i>{" "}
                  <strong>Company Number:</strong> {client.companyContact}
                </p>
                <p>
                  <i className="fas fa-calendar"></i>{" "}
                  <strong>Birthdate:</strong> {client.birthda}
                </p>
                <p>
                  <i className="fas fa-venus-mars"></i> <strong>Gender:</strong>{" "}
                  {client.gender}
                </p>

                <div className="button-group">
                  <button className="btn-edit" onClick={toggleEdit}>
                    {" "}
                    <i className="fas fa-edit"></i>Edit
                  </button>
                  <button className="btn-back" onClick={goBack}>
                    <i className="fas fa-arrow-left"></i>Back
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "appointments" && (
          <div className="client-details-table">
            {activeTab === "appointments" && (
              <div className="client-details-table">
                {activeTab === "appointments" && (
                  <div className="client-details-table">
                    {appointments && appointments.length > 0 ? (
                      <>
                        <table>
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Time</th>
                              <th>Consultation Type</th>
                              <th>Additional Info</th>
                              <th>Platform</th>
                              <th>Modified</th>
                            </tr>
                          </thead>
                          <tbody>
                            {appointments
                              .slice(
                                (currentPage - 1) * pageSize,
                                currentPage * pageSize
                              )
                              .map((appointment, index) => (
                                <tr key={index}>
                                  <td>{appointment.date}</td>
                                  <td>{appointment.time}</td>
                                  <td>{appointment.consultationType}</td>
                                  <td>{appointment.additionalInfo}</td>
                                  <td>{appointment.platform}</td>
                                  <td>{appointment.created_at}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>

                        <div className="pagination-buttons">
                          <button
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                          >
                            &lt;
                          </button>
                          <span>
                            Page {currentPage} of{" "}
                            {Math.ceil(appointments.length / pageSize)}
                          </span>
                          <button
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(
                                  prev + 1,
                                  Math.ceil(appointments.length / pageSize)
                                )
                              )
                            }
                            disabled={
                              currentPage ===
                              Math.ceil(appointments.length / pageSize)
                            }
                          >
                            &gt;
                          </button>
                        </div>
                      </>
                    ) : (
                      <p>No appointments available.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "projects" && (
          <div className="client-details-table">
            {projects.length > 0 ? (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Project Name</th>
                      <th>Description</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Status</th>
                      <th>Modified</th>
                      <th>Contract Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects
                      .slice(
                        (currentPage - 1) * pageSize,
                        currentPage * pageSize
                      )
                      .map((project, index) => (
                        <tr key={index}>
                          <td>{project.projectName}</td>
                          <td>{project.description}</td>
                          <td>{project.startDate}</td>
                          <td>{project.endDate}</td>
                          <td>{project.status}</td>
                          <td>{project.created_at}</td>
                          <td>{project.contractPrice}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                <div className="pagination-buttons">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>
                  <span>
                    Page {currentPage} of{" "}
                    {Math.ceil(projects.length / pageSize)}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          prev + 1,
                          Math.ceil(projects.length / pageSize)
                        )
                      )
                    }
                    disabled={
                      currentPage === Math.ceil(projects.length / pageSize)
                    }
                  >
                    &gt;
                  </button>
                </div>
              </>
            ) : (
              <p>No projects available.</p>
            )}
          </div>
        )}

        {activeTab === "files" && (
          <div className="client-details-table">
            {files.length > 0 ? (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Upload Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files
                      .slice(
                        (currentPage - 1) * pageSize,
                        currentPage * pageSize
                      )
                      .map((file, index) => (
                        <tr key={index}>
                          <td>
                            <a
                              href={`http://localhost:8081/uploads/${file.file_name}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {file.original_name}
                            </a>
                          </td>
                          <td>{file.upload_date}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                <div className="pagination-buttons">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>
                  <span>
                    Page {currentPage} of {Math.ceil(files.length / pageSize)}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, Math.ceil(files.length / pageSize))
                      )
                    }
                    disabled={
                      currentPage === Math.ceil(files.length / pageSize)
                    }
                  >
                    &gt;
                  </button>
                </div>
              </>
            ) : (
              <p>No files available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetails;
