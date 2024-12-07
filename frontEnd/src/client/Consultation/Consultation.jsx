import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../sidebar"; // Adjust the path as needed
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./consultation.css";

const Consultation = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [showOptions, setShowOptions] = useState(null); // Track open options menu

  const navigate = useNavigate();

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

  const handleOptionClick = (action, appointmentId) => {
    if (action === "reschedule") {
      console.log(`Rescheduling appointment ID: ${appointmentId}`);
      // Logic for rescheduling
    } else if (action === "cancel") {
      console.log(`Canceling appointment ID: ${appointmentId}`);
      // Logic for canceling
    }
    setShowOptions(null); // Close the options menu
  };

  return (
    <div className="consultation-page">
      <Sidebar />
      <div className="content">
        <h1>Consultation</h1>

        <div className="button-container">
          <Link to="/appointments/new" className="new-appointment-button">
            <button>+</button>
          </Link>
        </div>

        {loading ? (
          <p>Loading appointments...</p>
        ) : (
          <div className="main-content">
            <div className="appointments-container">
              <div className="calendar-section">
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  tileClassName={({ date }) => {
                    const appointmentDates = appointments.map((appointment) =>
                      new Date(appointment.date).toDateString()
                    );
                    return appointmentDates.includes(date.toDateString())
                      ? "appointment-date"
                      : null;
                  }}
                />
              </div>

              <div className="appointments-details">
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
                          <div className="more-options">
                            <button
                              className="more-options-button"
                              onClick={() =>
                                setShowOptions(
                                  showOptions === appointment.id
                                    ? null
                                    : appointment.id
                                )
                              }
                            >
                              :
                            </button>
                            {showOptions === appointment.id && (
                              <div className="more-options-menu">
                                <button
                                  onClick={() =>
                                    handleOptionClick("reschedule", appointment.id)
                                  }
                                >
                                  Reschedule
                                </button>
                                <button
                                  onClick={() =>
                                    handleOptionClick("cancel", appointment.id)
                                  }
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
                          <div className="more-options">
                            <button
                              className="more-options-button"
                              onClick={() =>
                                setShowOptions(
                                  showOptions === appointment.id
                                    ? null
                                    : appointment.id
                                )
                              }
                            >
                              :
                            </button>
                            {showOptions === appointment.id && (
                              <div className="more-options-menu">
                                <button
                                  onClick={() =>
                                    handleOptionClick("reschedule", appointment.id)
                                  }
                                >
                                  Reschedule
                                </button>
                                <button
                                  onClick={() =>
                                    handleOptionClick("cancel", appointment.id)
                                  }
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Consultation;
