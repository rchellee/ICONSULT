import React, { useEffect, useState, useContext } from "react";
import { SearchContext } from "../../components/SearchProvider";
import "./employee.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const EmployeeDetails = ({
  employee,
  showToast,
  hideToast,
  goBack,
  updateEmployee,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [tasks, setTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...employee });
  const [projects, setProjects] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { searchTerm } = useContext(SearchContext);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:8081/project");
      if (response.ok) {
        const data = await response.json();
        const projectMap = {};
        data.forEach((project) => {
          projectMap[project.id] = project.projectName;
        });
        setProjects(projectMap);
      } else {
        console.error("Failed to fetch projects");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      console.log("Fetching tasks for employee id:", employee.id);
      try {
        const response = await fetch(
          `http://localhost:8081/task/${employee.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error("Failed to fetch tasks");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchProjects();
    fetchTasks();
  }, [employee.id]);

  useEffect(() => {
    const filterTasks = () => {
      const searchValue = searchTerm.trim().toLowerCase();

      const filtered = tasks.filter((task) => {
        const taskName = (task.task_name || "").toLowerCase();
        const taskFee = String(task.task_fee || "").toLowerCase();
        const projectName = (projects[task.project_id] || "").toLowerCase();
        const status = (task.status || "").toLowerCase();
        const dueDate = formatDate(task.due_date).toLowerCase();
        const createdAt = formatDate(task.created_at).toLowerCase();
        const updatedAt = formatDate(task.updated_at).toLowerCase();

        return (
          taskName.includes(searchValue) ||
          taskFee.includes(searchValue) ||
          projectName.includes(searchValue) ||
          status.includes(searchValue) ||
          dueDate.includes(searchValue) ||
          createdAt.includes(searchValue) ||
          updatedAt.includes(searchValue)
        );
      });

      setFilteredTasks(filtered);
    };

    if (searchTerm) {
      filterTasks();
    } else {
      setFilteredTasks(tasks); // Show all tasks when no search term
    }
  }, [searchTerm, tasks, projects]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newAge = formData.age;

    if (name === "birthday" && value) {
      const formattedDate = new Date(value).toISOString().split("T")[0];
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      // Adjust age if the current date is before the birthdate this year
      newAge =
        monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

      setFormData({
        ...formData,
        birthday: formattedDate,
        age: newAge,
      });
      return; // Exit here to avoid setting the raw value
    }

    // Update other fields
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Handle save action
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        firstName: formData.firstName?.toUpperCase() || "",
        middleName: formData.middleName?.toUpperCase() || "",
        lastName: formData.lastName?.toUpperCase() || "",
        address: formData.address?.toUpperCase() || "",
        role: formData.role?.toUpperCase() || "",
      };

      const response = await fetch(
        `http://localhost:8081/employee/${employee.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedData),
        }
      );

      if (response.ok) {
        const updatedEmployee = await response.json();
        updateEmployee(updatedEmployee);
        showToast();
        goBack();
        hideToast();
      } else {
        console.error("Error updating employee:", await response.text());
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="employee-details">
      <div className="tabs">
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => handleTabClick("overview")}
        >
          Overview
        </button>
        <button
          className={activeTab === "tasks" ? "active" : ""}
          onClick={() => handleTabClick("tasks")}
        >
          Tasks
        </button>
      </div>
      <div className="employee-info">
        {activeTab === "overview" && (
          <>
            {isEditing ? (
              <form
                onSubmit={handleSave}
                className="employee-editing-form-grid"
              >
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
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                      placeholder="Middle Name"
                    />
                    <div className="input-icon">
                      <i className="fa fa-user"></i>
                    </div>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="row">
                  <div className="input-group input-group-icon">
                    <input
                      type="email"
                      name="email_add"
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
                      type="tel"
                      name="mobile_number"
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
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Address"
                    />
                    <div className="input-icon">
                      <i className="fa fa-map-marker-alt"></i>
                    </div>
                  </div>
                </div>

                {/* Birthday and Role Section */}
                <div className="row">
                  <h4>Birthdate</h4>
                  <div className="input-group input-group-icon">
                    <input
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleChange}
                    />
                    <div className="input-icon">
                      <i className="fa fa-calendar"></i>
                    </div>
                  </div>
                  <h4>Age</h4>
                  <div className="input-group input-group-icon">
                    <input
                      type="text"
                      name="age"
                      placeholder="Age"
                      value={formData.age}
                      readOnly
                    />
                    <div className="input-icon">
                      <i className="fa fa-calendar"></i>
                    </div>
                  </div>
                  <div className="button-group">
                    <button type="submit" className="btn-save">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={toggleEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Status Section and Role*/}
                <div className="row">
                  <h4>Gender</h4>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <h4>Role</h4>
                  <div className="input-group input-group-icon">
                    <input
                      type="text"
                      name="role"
                      placeholder="Position"
                      value={formData.role}
                      onChange={handleChange}
                    />
                    <div className="input-icon">
                      <i className="fa fa-user"></i>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              // Display Section (Read-only mode with icons and centered form)
              <div className="employee-readonly">
                <p>
                  <i className="fas fa-user"></i> <strong>Last Name:</strong>{" "}
                  {employee.lastName}
                </p>
                <p>
                  <i className="fas fa-user"></i> <strong>First Name:</strong>{" "}
                  {employee.firstName}
                </p>
                <p>
                  <i className="fas fa-user"></i> <strong>Middle Name:</strong>{" "}
                  {employee.middleName}
                </p>
                <p>
                  <i className="fas fa-envelope"></i> <strong>Email:</strong>{" "}
                  {employee.email_add}
                </p>
                <p>
                  <i className="fas fa-map-marker-alt"></i>{" "}
                  <strong>Address:</strong> {employee.address}
                </p>
                <p>
                  <i className="fas fa-phone"></i>{" "}
                  <strong>Contact Number:</strong> {employee.mobile_number}
                </p>
                <p>
                  <i className="fas fa-birthday-cake"></i>{" "}
                  <strong>Birthday:</strong> {formatDate(employee.birthday)}
                </p>
                <p>
                  <i className="fas fa-user-tag"></i> <strong>Role:</strong>{" "}
                  {employee.role}
                </p>
                <p>
                  <i className="fas fa-user-check"></i>{" "}
                  <strong>Date Modified:</strong>{" "}
                  {formatDate(employee.modified_date)}
                </p>
                <div className="button-group">
                  {!isEditing && (
                    <button className="btn-edit" onClick={toggleEdit}>
                      Edit
                    </button>
                  )}
                  <button className="btn-back" onClick={goBack}>
                    Back
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        {activeTab === "tasks" && (
          <div className="client-details-table">
            {tasks.length > 0 ? (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Fee</th>
                      <th>Project</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Date Created</th>
                      <th>Date Modified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks
                      .slice(
                        (currentPage - 1) * pageSize,
                        currentPage * pageSize
                      )
                      .map((task, index) => (
                        <tr key={index}>
                          <td>{task.task_name}</td>
                          <td>{task.task_fee}.00</td>
                          <td>
                            {projects[task.project_id] || "Unknown Project"}
                          </td>
                          <td>{formatDate(task.due_date)}</td>
                          <td>{task.status}</td>
                          <td>{formatDate(task.created_at)}</td>
                          <td>{formatDate(task.updated_at)}</td>
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
                    Page {currentPage} of {Math.ceil(tasks.length / pageSize)}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, Math.ceil(tasks.length / pageSize))
                      )
                    }
                    disabled={
                      currentPage === Math.ceil(tasks.length / pageSize)
                    }
                  >
                    &gt;
                  </button>
                </div>
              </>
            ) : (
              <p>No tasks available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetails;
