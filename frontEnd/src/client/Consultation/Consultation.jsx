import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  Typography,
  useTheme,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Sidebar from "../sidebar";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { Link } from "react-router-dom";
import "./consultation.css";

const Consultation = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [appointments, setAppointments] = useState([]);
  const [clientId, setClientId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [visibleSection, setVisibleSection] = useState(null); // Track which section is visible
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    // Fetch clientId from localStorage
    const storedClientId = localStorage.getItem('clientId');
    if (storedClientId) {
      setClientId(storedClientId);
      fetchAppointments(storedClientId);
    }
  }, []);

  const fetchAppointments = async (clientId) => {
    try {
      const response = await axios.get('http://localhost:8081/appointments');
      const filteredAppointments = response.data.filter(
        (appointment) => appointment.client_id === parseInt(clientId)
      );
      setAppointments(filteredAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // Function to format the date for display
  const formatDayAndDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.toLocaleDateString(undefined, { weekday: "long" });
    const options = { month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString(undefined, options);
    return `${day}, ${formattedDate}`;
  };

// Function to get appointments dynamically categorized by status
const getAppointmentsByView = (status) => {
  const today = new Date();

  // Filter and sort the appointments
  const sortedAppointments = appointments
    .filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      if (status === "Upcoming") {
        return appointmentDate >= today; // Future appointments
      } else if (status === "Completed") {
        return appointmentDate < today; // Past appointments
      }
      return false;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date (ascending)

  return sortedAppointments;
};

  // Toggle section visibility
  const toggleSection = (section) => {
    setVisibleSection(visibleSection === section ? null : section);
  };

  // Map appointments into FullCalendar events
  const mapAppointmentsToEvents = () => {
    return appointments.map((appointment) => ({
      title: `Consultation - ${appointment.consultationType}`,
      start: appointment.date, // ISO string format
      allDay: true,
      extendedProps: {
        time: appointment.time,
        platform: appointment.platform,
        name: appointment.name,
        email: appointment.email,
        contact: appointment.contact,
        companyName: appointment.companyName,
        reminder: appointment.reminder,
      },
    }));
  };


  const handleMouseEnter = (selected) => {
    const { title, extendedProps } = selected.event;
    setPopup({
      title,
      time: extendedProps.time,
      x: selected.jsEvent.clientX,
      y: selected.jsEvent.clientY,
    });
  };

  const handleMouseLeave = () => {
    // Delay hiding the popup slightly to allow for smooth transitions to the popup itself
    setTimeout(() => {
      setPopup(null);
    }, 100000); // Adjust delay as needed
  };

  return (
    <div className="consultation-page">
      <Sidebar />
      <div className="content">
        <Box m="20px">
          <Header title="Consultation" />
          <Box display="flex">
            {/* Sidebar */}
            <div className="consultation-content">
              <div className="button-consult">
                <Link to="/appointments/new" className="new-appointment-button">
                  <button>+ Schedule Consultation</button>
                </Link>
              </div>

              {loading ? (
                <p>Loading appointments...</p>
              ) : (
                <div className="appointments-and-calendar">
                  <div className="appointments-details">
                    <h4>Appointments</h4>

                    {/* Upcoming Appointments */}
                    <div className="upcoming-appointments">
                      <button onClick={() => toggleSection("Upcoming")}>
                        {visibleSection === "Upcoming" ? "<" : ">"} Upcoming
                      </button>

                      {visibleSection === "Upcoming" && (
                        <div className="appointments-list-container">
                          {getAppointmentsByView("Upcoming").length > 0 ? (
                            <ul>
                              {getAppointmentsByView("Upcoming").map((appointment, index) => (
                                <li key={index} className="appointment-item">
                                  <div className="date-box">
                                    {formatDayAndDate(appointment.date)} at {appointment.time}
                                  </div>
                                  <div className="details-box">
                                    <p><strong>Name:</strong> {appointment.name}</p>
                                    <p><strong>Email:</strong> {appointment.email}</p>
                                    <p><strong>Contact:</strong> {appointment.contact}</p>
                                    <p><strong>Type:</strong> {appointment.consultationType}</p>
                                    <p><strong>Platform:</strong> {appointment.platform}</p>
                                    <p><strong>Company:</strong> {appointment.companyName}</p>
                                    <p><strong>Reminder:</strong> {appointment.reminder}</p>
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
                      <button onClick={() => toggleSection("Completed")}>
                        {visibleSection === "Completed" ? "<" : ">"} Completed
                      </button>

                      {visibleSection === "Completed" && (
                        <div className="appointments-list-container">
                          {getAppointmentsByView("Completed").length > 0 ? (
                            <ul>
                              {getAppointmentsByView("Completed").map((appointment, index) => (
                                <li key={index} className="appointment-item">
                                  <div className="date-box">
                                    {formatDayAndDate(appointment.date)} at {appointment.time}
                                  </div>
                                  <div className="details-box">
                                    <p><strong>Name:</strong> {appointment.name}</p>
                                    <p><strong>Email:</strong> {appointment.email}</p>
                                    <p><strong>Contact:</strong> {appointment.contact}</p>
                                    <p><strong>Type:</strong> {appointment.consultationType}</p>
                                    <p><strong>Platform:</strong> {appointment.platform}</p>
                                    <p><strong>Company:</strong> {appointment.companyName}</p>
                                    <p><strong>Reminder:</strong> {appointment.reminder}</p>
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

            {/* FullCalendar */}

            <Box flex="1 1 70%" ml="10px">
              <FullCalendar
                height="75vh"
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  interactionPlugin,
                  listPlugin,
                ]}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                }}
                initialView="dayGridMonth"
                editable={false}
                selectable={false}
                events={mapAppointmentsToEvents()} // Pass appointments as events here
                eventMouseEnter={handleMouseEnter}
                eventMouseLeave={handleMouseLeave}
                eventContent={(eventInfo) => (
                  <div>
                    <b>{eventInfo.event.title}</b>
                  </div>
                )}
              />
              {popup && (
                <Box
                  sx={{
                    position: "absolute",
                    top: popup.y + 10,
                    left: popup.x + 10,
                    backgroundColor: "white",
                    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                    borderRadius: "5px",
                    padding: "10px",
                    zIndex: 1000,
                  }}
                  onMouseEnter={() => clearTimeout()} // Prevent hiding when mouse enters popup
                  onMouseLeave={() => setPopup(null)} // Hide popup when mouse leaves
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {popup.title}
                  </Typography>
                  <Typography variant="body2">Time: {popup.time}</Typography>
                  <Box sx={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button
                      style={{
                        backgroundColor: "#4caf50",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        console.log("Edit clicked for event:", popup.title);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        console.log("Delete clicked for event:", popup.title);
                      }}
                    >
                      Delete
                    </button>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Consultation;
