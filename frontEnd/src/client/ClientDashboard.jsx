//clientdashboard

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Sidebar from "../client/sidebar";
import "./client.css";

function ClientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate] = useState(new Date());
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [projects, setProjects] = useState([]); // State for projects
  const [tasks, setTasks] = useState([]); // State for tasks
  const [selectedMenuToday, setSelectedMenuToday] = useState(null); // Track which menu is open for today's appointments
  const [selectedMenuAll, setSelectedMenuAll] = useState(null); // Track which menu is open for all appointments
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Fetch appointments from the API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const clientId = localStorage.getItem("clientId");
        if (!clientId) {
          console.error("Client ID not found!");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:8081/appointments/client/${clientId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Fetch projects from the API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const clientId = localStorage.getItem("clientId");
        if (!clientId) {
          console.error("Client ID not found!");
          return;
        }

        const response = await fetch(
          `http://localhost:8081/projects/client/${clientId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  // Fetch tasks from the API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const clientId = localStorage.getItem("clientId");
        if (!clientId) {
          console.error("Client ID not found!");
          return;
        }

        const response = await fetch(
          `http://localhost:8081/tasks/client/${clientId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  // Filter appointments for the selected date
  useEffect(() => {
    const filtered = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getFullYear() === selectedDate.getFullYear() &&
        appointmentDate.getMonth() === selectedDate.getMonth() &&
        appointmentDate.getDate() === selectedDate.getDate()
      );
    });
    setFilteredAppointments(filtered);
  }, [selectedDate, appointments]);

  const formatDayAndDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.toLocaleDateString(undefined, { weekday: "long" });
    const options = { month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString(undefined, options);
    return `${day}, ${formattedDate}`;
  };

  // Toggle menu for today's appointments
  const handleMenuToggleToday = (index) => {
    setSelectedMenuToday(selectedMenuToday === index ? null : index);
  };

  // Toggle menu for all appointments
  const handleMenuToggleAll = (index) => {
    setSelectedMenuAll(selectedMenuAll === index ? null : index);
  };

  // Handle rescheduling (navigate to reschedule form)
  const handleReschedule = (appointmentId) => {
    navigate(`/reschedule/${appointmentId}`);
  };

  // Handle cancellation
  const handleCancel = async (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        const response = await fetch(
          `http://localhost:8081/appointments/${appointmentId}`,
          {
            method: "DELETE", // Assuming DELETE cancels the appointment
          }
        );
        if (response.ok) {
          setAppointments((prev) =>
            prev.filter((appointment) => appointment.id !== appointmentId)
          );
          alert("Appointment canceled successfully.");
        } else {
          throw new Error("Failed to cancel appointment.");
        }
      } catch (error) {
        console.error("Error canceling appointment:", error);
      }
    }
  };

  return (
    <div className="client-home-page">
      <Sidebar />
      <div className="content">
        <h1>Dashboard</h1>

        {loading ? (
          <p>Loading appointments...</p>
        ) : (
          <>
            {/* Today's Appointments */}
            <div className="appointment-list">
              <h3>Appointments for Today</h3>
              {filteredAppointments.length > 0 ? (
                <ul>
                  {filteredAppointments.map((appointment, index) => (
                    <li key={index} className="appointment-item">
                      <div className="date-box">
                        <strong>{formatDayAndDate(appointment.date)}</strong>
                      </div>
                      <div className="details-box">
                        <p>
                          <strong>Time:</strong> {appointment.time}
                        </p>
                        <p>
                          <strong>Consultation Type:</strong>{" "}
                          {appointment.consultationType}
                        </p>
                        <p>
                          <strong>Platform:</strong> {appointment.platform}
                        </p>
                      </div>
                      {/* Action Menu */}
                      <div className="action-menu">
                        <button
                          className="menu-button"
                          onClick={() => handleMenuToggleToday(index)}
                        >
                          &#58;
                        </button>
                        {selectedMenuToday === index && (
                          <div className="dropdown-menu">
                            <button onClick={() => handleReschedule(appointment.id)}>
                              Reschedule
                            </button>
                            <button onClick={() => handleCancel(appointment.id)}>
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No appointments for today.</p>
              )}
            </div>

            {/* Ongoing Projects */}
            <div className="ongoing-projects">
              <h3>Ongoing Projects</h3>
              {projects.length > 0 ? (
                <ul>
                  {projects.map((project, index) => (
                    <li key={index} className="project-item">
                      <div className="project-details">
                        <h4>{project.name}</h4>
                        <div className="progress-bar">
                          <div
                            className="progress"
                            style={{ width: `${project.progress}%` }}
                          >
                            {project.progress}%
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No ongoing projects available.</p>
              )}
            </div>

            {/* Task Overview */}
            <div className="task-overview">
              <h3>Task Overview</h3>
              {tasks.length > 0 ? (
                <ul>
                  {tasks.map((task, index) => (
                    <li key={index} className="task-item">
                      <div className="task-details">
                        <h4>{task.name}</h4>
                        <p>
                          <strong>Deadline:</strong> {formatDayAndDate(task.deadline)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tasks available.</p>
              )}
            </div>

            {/* All Appointments */}
            <div className="all-appointments">
              <h3>My Appointments</h3>
              {appointments.length > 0 ? (
                <ul>
                  {appointments.map((appointment, index) => (
                    <li key={index} className="appointment-item">
                      <div className="date-box">
                        <strong>{formatDayAndDate(appointment.date)}</strong>
                      </div>
                      <div className="details-box">
                        <p>
                          <strong>Time:</strong> {appointment.time}
                        </p>
                        <p>
                          <strong>Consultation Type:</strong>{" "}
                          {appointment.consultationType}
                        </p>
                        <p>
                          <strong>Platform:</strong> {appointment.platform}
                        </p>
                      </div>
                      {/* Action Menu */}
                      <div className="action-menu">
                        <button
                          className="menu-button"
                          onClick={() => handleMenuToggleAll(index)}
                        >
                          &#58;
                        </button>
                        {selectedMenuAll === index && (
                          <div className="dropdown-menu">
                            <button onClick={() => handleReschedule(appointment.id)}>
                              Reschedule
                            </button>
                            <button onClick={() => handleCancel(appointment.id)}>
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No appointments available.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ClientDashboard;