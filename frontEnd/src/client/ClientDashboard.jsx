import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../client/sidebar";
import "./client.css";

function ClientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate] = useState(new Date());
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedMenuToday, setSelectedMenuToday] = useState(null);
  const [selectedMenuAll, setSelectedMenuAll] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const clientId = localStorage.getItem("clientId");
        if (!clientId) return;

        const response = await fetch(`http://localhost:8081/appointments/client/${clientId}`);
        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const clientId = localStorage.getItem("clientId");
        if (!clientId) return;

        const response = await fetch(`http://localhost:8081/projects/client/${clientId}`);
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const clientId = localStorage.getItem("clientId");
        if (!clientId) return;

        const response = await fetch(`http://localhost:8081/tasks/client/${clientId}`);
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const filtered = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.getFullYear() === selectedDate.getFullYear() &&
             appointmentDate.getMonth() === selectedDate.getMonth() &&
             appointmentDate.getDate() === selectedDate.getDate();
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

  const handleReschedule = (appointmentId) => {
    navigate(`/reschedule/${appointmentId}`);
  };

  const handleCancel = async (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        const response = await fetch(`http://localhost:8081/appointments/${appointmentId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setAppointments((prev) => prev.filter((appointment) => appointment.id !== appointmentId));
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

      <div className="dashboard-content">
      <Sidebar />
        <h1>Client Dashboard</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="dashboard-grid">
              {/* Today's Appointments */}
              <div className="card appointment-list">
                <h3>Today's Appointments</h3>
                {filteredAppointments.length > 0 ? (
                  <ul>
                    {filteredAppointments.map((appointment, index) => (
                      <li key={index} className="appointment-item">
                        <div className="date-box">
                          <strong>{formatDayAndDate(appointment.date)}</strong>
                        </div>
                        <div className="details-box">
                          <p><strong>Time:</strong> {appointment.time}</p>
                          <p><strong>Consultation:</strong> {appointment.consultationType}</p>
                          <p><strong>Platform:</strong> {appointment.platform}</p>
                        </div>
                        <div className="action-menu">
                          <button className="menu-button" onClick={() => setSelectedMenuToday(index === selectedMenuToday ? null : index)}>
                            &#x22EE;
                          </button>
                          {selectedMenuToday === index && (
                            <div className="dropdown-menu">
                              <button onClick={() => handleReschedule(appointment.id)}>Reschedule</button>
                              <button onClick={() => handleCancel(appointment.id)}>Cancel</button>
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
              <div className="card ongoing-projects">
                <h3>Ongoing Projects</h3>
                {projects.length > 0 ? (
                  <ul>
                    {projects.map((project, index) => (
                      <li key={index} className="project-item">
                        <div className="project-details">
                          <h4>{project.name}</h4>
                          <div className="progress-bar">
                            <div className="progress" style={{ width: `${project.progress}%` }}>
                              {project.progress}%
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No ongoing projects.</p>
                )}
              </div>

              {/* Task Overview */}
              <div className="card task-overview">
                <h3>Task Overview</h3>
                {tasks.length > 0 ? (
                  <ul>
                    {tasks.map((task, index) => (
                      <li key={index} className="task-item">
                        <div className="task-details">
                          <h4>{task.name}</h4>
                          <p><strong>Deadline:</strong> {formatDayAndDate(task.deadline)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No tasks available.</p>
                )}
              </div>

              {/* All Appointments */}
              <div className="card all-appointments">
                <h3>My Appointments</h3>
                {appointments.length > 0 ? (
                  <ul>
                    {appointments.map((appointment, index) => (
                      <li key={index} className="appointment-item">
                        <div className="date-box">
                          <strong>{formatDayAndDate(appointment.date)}</strong>
                        </div>
                        <div className="details-box">
                          <p><strong>Time:</strong> {appointment.time}</p>
                          <p><strong>Consultation:</strong> {appointment.consultationType}</p>
                          <p><strong>Platform:</strong> {appointment.platform}</p>
                        </div>
                        <div className="action-menu">
                          <button className="menu-button" onClick={() => setSelectedMenuAll(index === selectedMenuAll ? null : index)}>
                            &#x22EE;
                          </button>
                          {selectedMenuAll === index && (
                            <div className="dropdown-menu">
                              <button onClick={() => handleReschedule(appointment.id)}>Reschedule</button>
                              <button onClick={() => handleCancel(appointment.id)}>Cancel</button>
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ClientDashboard;
