import React, { useState, useEffect } from "react";
import './client.css';

const ClientDetails = ({ client, goBack, updateClient }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...client });
  const [appointments, setAppointments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [files, setFiles] = useState([]);
  const [sortOrder, setSortOrder] = useState({ field: null, order: "asc" });
  const [filter, setFilter] = useState({ month: "", year: "" });

  // Example data
  useEffect(() => {
    const sampleAppointments = [
      { date: "2025-01-25", details: "Initial consultation", status: "Completed", type: "Consultation" },
      { date: "2025-12-21", details: "Follow-up meeting", status: "Scheduled", type: "Meeting" },
    ];

    const sampleProjects = [
      { projectName: "Project A", startDate: "2025-01-01", endDate: "2025-06-01", status: "In Progress" },
      { projectName: "Project B", startDate: "2025-02-01", endDate: "2025-07-01", status: "Completed" },
    ];

    const sampleFiles = [
      { documentName: "Contract.pdf", uploadedDate: "2025-01-01", type: "PDF" },
      { documentName: "Invoice.xlsx", uploadedDate: "2025-01-05", type: "Excel" },
    ];

    setAppointments(sampleAppointments);
    setProjects(sampleProjects);
    setFiles(sampleFiles);
  }, []);

  const sortData = (data, field) => {
    const order = sortOrder.field === field && sortOrder.order === "asc" ? "desc" : "asc";
    const sortedData = [...data].sort((a, b) => {
      if (a[field] < b[field]) return order === "asc" ? -1 : 1;
      if (a[field] > b[field]) return order === "asc" ? 1 : -1;
      return 0;
    });
    setSortOrder({ field, order });
    return sortedData;
  };

  const handleSort = (tab, field) => {
    if (tab === "appointments") setAppointments(sortData(appointments, field));
    if (tab === "projects") setProjects(sortData(projects, field));
    if (tab === "files") setFiles(sortData(files, field));
  };

  const renderSortIcon = (field) => {
    if (sortOrder.field === field) {
      return sortOrder.order === "asc" ? "▲" : "▼";
    }
    return "⇅";
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const filterDataByDate = (data, dateField) => {
    if (!filter.month && !filter.year) {
      return data; // Show all data if no filter is selected
    }

    return data.filter((item) => {
      const itemDate = new Date(item[dateField]);
      const filterMonth = filter.month ? parseInt(filter.month) : null;
      const filterYear = filter.year ? parseInt(filter.year) : null;
  
      return (
        (!filterMonth || itemDate.getMonth() + 1 === filterMonth) &&
        (!filterYear || itemDate.getFullYear() === filterYear)
      );
    });
  };

  const filteredAppointments = filterDataByDate(appointments, "date");
  const filteredProjects = filterDataByDate(projects, "startDate");
  const filteredFiles = filterDataByDate(files, "uploadedDate");

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="client-details">
      <div className="tabs">
        <button onClick={() => setActiveTab("overview")} className={activeTab === "overview" ? "active" : ""}>
          Overview
        </button>
        <button onClick={() => setActiveTab("appointments")} className={activeTab === "appointments" ? "active" : ""}>
          Appointments
        </button>
        <button onClick={() => setActiveTab("projects")} className={activeTab === "projects" ? "active" : ""}>
          Projects
        </button>
        <button onClick={() => setActiveTab("files")} className={activeTab === "files" ? "active" : ""}>
          Files
        </button>
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
                  <div className="overview-edit-button-group">
                  <button type="submit" className="btn-save"><i className="fas fa-save"></i> Save Changes</button>
                  <button type="button" className="btn-cancel" onClick={toggleEdit}><i className="fas fa-times"></i> Cancel</button>
                </div>
                </div>

                {/* Save and Cancel Buttons */}
            
              </form>
            ) : (
              <div className="client-readonly grid">
                <p><strong>First Name:</strong> {client.firstName}</p>
                <p><strong>Last Name:</strong> {client.lastName}</p>
                <p><strong>Email Address:</strong> {client.email}</p>
                <p><strong>Age:</strong> {client.age}</p>
                <p><strong>Nationality:</strong> {client.nationality}</p>
                <p><strong>Mobile Number:</strong> {client.mobileNumber}</p>
                <p><strong>Address:</strong> {client.address}</p>
                <p><strong>City:</strong> {client.city}</p>
                <p><strong>Postal Code:</strong> {client.postalCode}</p>
                <p><strong>Company Name:</strong> {client.companyName}</p>
                <p><strong>Position in Company:</strong> {client.positionInCompany}</p>
                <p><strong>Company Number:</strong> {client.companyContactNumber}</p>
                <p><strong>Birthdate:</strong> {client.birthdate}</p>
                <p><strong>Gender:</strong> {client.gender}</p>

                <div className="client-readonly-button-group">
                  <button className="btn-edit" onClick={toggleEdit}>Edit</button>
                  <button className="btn-back" onClick={goBack}>Back</button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Filter Section for Appointments, Projects, and Files Tabs */}
        {(activeTab === "appointments" || activeTab === "projects" || activeTab === "files") && (
          <div className="client-filter-section">
            <select name="month" value={filter.month} onChange={handleFilterChange}>
              <option value="">Months</option>
              {[...Array(12).keys()].map((m) => (
                <option key={m + 1} value={m + 1}>
                  {new Date(0, m).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
            <select name="year" value={filter.year} onChange={handleFilterChange}>
              <option value="">Years</option>
              {[2025, 2024, 2023].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort("appointments", "date")}>Date {renderSortIcon("date")}</th>
                <th>Details</th>
                <th>Status</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment, index) => (
                <tr key={index}>
                  <td>{appointment.date}</td>
                  <td>{appointment.details}</td>
                  <td>{appointment.status}</td>
                  <td>{appointment.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort("projects", "projectName")}>Project Name {renderSortIcon("projectName")}</th>
                <th onClick={() => handleSort("projects", "startDate")}>Start Date {renderSortIcon("startDate")}</th>
                <th onClick={() => handleSort("projects", "endDate")}>End Date {renderSortIcon("endDate")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project, index) => (
                <tr key={index}>
                  <td>{project.projectName}</td>
                  <td>{project.startDate}</td>
                  <td>{project.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Files Tab */}
        {activeTab === "files" && (
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort("files", "documentName")}>Document Name {renderSortIcon("documentName")}</th>
                <th onClick={() => handleSort("files", "uploadedDate")}>Uploaded Date {renderSortIcon("uploadedDate")}</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file, index) => (
                <tr key={index}>
                  <td>{file.documentName}</td>
                  <td>{file.uploadedDate}</td>
                  <td>{file.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ClientDetails;
