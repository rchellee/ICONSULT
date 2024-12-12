import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../sidebar"; // Adjust the path as needed
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./consultation.css";

const Consultation = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      date: "2024-12-15T10:00:00Z", // Upcoming appointment
      time: "10:00 AM",
      consultationType: "Consultation Type A",
      platform: "Zoom",
      status: "Upcoming"
    },
    {
      id: 2,
      date: "2024-12-16T14:00:00Z", // Upcoming appointment
      time: "02:00 PM",
      consultationType: "Consultation Type B",
      platform: "Skype",
      status: "Upcoming"
    },
    {
      id: 3,
      date: "2024-12-10T09:00:00Z", // Completed appointment
      time: "09:00 AM",
      consultationType: "Consultation Type C",
      platform: "Google Meet",
      status: "Completed"
    },
    {
      id: 4,
      date: "2024-12-09T16:00:00Z", // Completed appointment
      time: "04:00 PM",
      consultationType: "Consultation Type D",
      platform: "Teams",
      status: "Completed"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [showOptions, setShowOptions] = useState(null); // Track open options menu
  const [view, setView] = useState("upcoming"); // Default view is "upcoming"
  const [showUpcomingAppointments, setShowUpcomingAppointments] = useState(false); // To control visibility of upcoming appointments
  const [showCompletedAppointments, setShowCompletedAppointments] = useState(false); // To control visibility of completed appointments

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
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
    } else if (action === "cancel") {
      console.log(`Canceling appointment ID: ${appointmentId}`);
    }
    setShowOptions(null); // Close the options menu
  };

  const getAppointmentsByView = (status) => {
    return appointments.filter((appointment) => appointment.status === status);
  };

  const toggleUpcomingAppointments = () => {
    setShowUpcomingAppointments(!showUpcomingAppointments);
  };
  
  const toggleCompletedAppointments = () => {
    setShowCompletedAppointments(!showCompletedAppointments);
  };

  return (
    <div className="consultation-page">
      <Sidebar />
      <div className="content">
        <div className="consultation-content">
          <h3>Consultation</h3>

          <div className="button-container">
            <Link to="/appointments/new" className="new-appointment-button">
              <button>+</button>
            </Link>
          </div>

          {loading ? (
            <p>Loading appointments...</p>
          ) : (
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
                <h3>Appointment</h3>

                {/* Upcoming Appointments */}
                <div className="upcoming-appointments">
                  <button
                    onClick={toggleUpcomingAppointments}
                  >
                    {showUpcomingAppointments ? ">" : "<"} Upcoming
                  </button>

                  {showUpcomingAppointments && (
                    <div className="appointments-list-container">
                      {getAppointmentsByView("Upcoming").length > 0 ? (
                        <ul>
                          {getAppointmentsByView("Upcoming").map((appointment, index) => (
                            <li key={index} className="appointment-item">
                              <div className="date-box">
                                <strong>{formatDayAndDate(appointment.date)}</strong>
                              </div>
                              <div className="details-box">
                                <p><strong>Time:</strong> {appointment.time}</p>
                                <p><strong>Consultation Type:</strong> {appointment.consultationType}</p>
                                <p><strong>Platform:</strong> {appointment.platform}</p>
                              </div>
                              <div className="more-options">
                                <button
                                  className="more-options-button"
                                  onClick={() => setShowOptions(
                                    showOptions === appointment.id ? null : appointment.id
                                  )}
                                >
                                  :
                                </button>
                                {showOptions === appointment.id && (
                                  <div className="more-options-menu">
                                    <button onClick={() => handleOptionClick("reschedule", appointment.id)}>
                                      Reschedule
                                    </button>
                                    <button onClick={() => handleOptionClick("cancel", appointment.id)}>
                                      Cancel
                                    </button>
                                  </div>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No upcoming appointments.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Completed Appointments */}
                <div className="completed-appointments">
                  <button
                    onClick={toggleCompletedAppointments}
                  >
                    {showCompletedAppointments ? ">" : "<"} Completed
                  </button>

                  {showCompletedAppointments && (
                    <div className="appointments-list-container">
                      {getAppointmentsByView("Completed").length > 0 ? (
                        <ul>
                          {getAppointmentsByView("Completed").map((appointment, index) => (
                            <li key={index} className="appointment-item">
                              <div className="date-box">
                                <strong>{formatDayAndDate(appointment.date)}</strong>
                              </div>
                              <div className="details-box">
                                <p><strong>Time:</strong> {appointment.time}</p>
                                <p><strong>Consultation Type:</strong> {appointment.consultationType}</p>
                                <p><strong>Platform:</strong> {appointment.platform}</p>
                              </div>
                              <div className="more-options">
                                <button
                                  className="more-options-button"
                                  onClick={() => setShowOptions(
                                    showOptions === appointment.id ? null : appointment.id
                                  )}
                                >
                                  :
                                </button>
                                {showOptions === appointment.id && (
                                  <div className="more-options-menu">
                                    <button onClick={() => handleOptionClick("reschedule", appointment.id)}>
                                      Reschedule
                                    </button>
                                    <button onClick={() => handleOptionClick("cancel", appointment.id)}>
                                      Cancel
                                    </button>
                                  </div>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No completed appointments.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Consultation;
