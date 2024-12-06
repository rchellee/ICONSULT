//Consultation.jsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../sidebar"; // Adjust the path as needed
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./consultation.css"; // Add your styles for consultation page

const Consultation = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [showOptions, setShowOptions] = useState(null); // State for toggling the options
  const navigate = useNavigate();

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

  // Reschedule an appointment (Navigate to reschedule page)
  const handleReschedule = (appointmentId) => {
    navigate(`/appointments/reschedule/${appointmentId}`);
  };

  // Handle canceling the appointment
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

  // Toggle the options menu for the clicked appointment
  const toggleOptions = (appointmentId) => {
    setShowOptions((prev) => (prev === appointmentId ? null : appointmentId));
  };

  return (
    <div className="consultation-page">
      <Sidebar />
      <div className="content">
        <h1>Consultation</h1>

        {/* Add Appointment Button */}
        <div className="button-container">
          <Link to="/appointments/new" className="new-appointment-button">
            <button>+ Add New Appointment</button>
          </Link>
        </div>

        {loading ? (
          <p>Loading appointments...</p>
        ) : (
          <>
            {/* Calendar Section */}
            <div className="calendar-section">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={({ date }) => {
                  const appointmentDates = appointments.map((appointment) =>
                    new Date(appointment.date).toDateString()
                  );
                  return appointmentDates.includes(date.toDateString())
                    ? "highlight"
                    : null;
                }}
              />
            </div>

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

                      {/* More options button */}
                      <div className="more-options">
                        <button
                          className="more-options-button"
                          onClick={() => toggleOptions(appointment.id)} // Toggle options menu
                        >
                          &#58;
                        </button>
                        {/* Display the menu only for the selected appointment */}
                        {showOptions === appointment.id && (
                          <div className="more-options-menu">
                            <button
                              className="reschedule-button"
                              onClick={() => handleReschedule(appointment.id)}
                            >
                              Reschedule
                            </button>
                            <button
                              className="cancel-button"
                              onClick={() => handleCancel(appointment.id)}
                            >
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

            {/* All Appointments */}
            <div className="all-appointments">
              <h3>All Appointments</h3>
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

                      {/* More options button */}
                      <div className="more-options">
                        <button
                          className="more-options-button"
                          onClick={() => toggleOptions(appointment.id)} // Toggle options menu
                        >
                          &#58;
                        </button>
                        {/* Display the menu only for the selected appointment */}
                        {showOptions === appointment.id && (
                          <div className="more-options-menu">
                            <button
                              className="reschedule-button"
                              onClick={() => handleReschedule(appointment.id)}
                            >
                              Reschedule
                            </button>
                            <button
                              className="cancel-button"
                              onClick={() => handleCancel(appointment.id)}
                            >
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
};

export default Consultation;