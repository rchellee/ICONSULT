import React, { useState, useEffect } from "react";
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
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      date: "2024-12-15T10:00:00Z", // Upcoming appointment
      time: "10:00 AM",
      platform: "Zoom",
      status: "Upcoming",
    },
    {
      id: 2,
      date: "2024-12-16T14:00:00Z", // Upcoming appointment
      time: "02:00 PM",
      platform: "Skype",
      status: "Upcoming",
    },
    {
      id: 3,
      date: "2024-12-10T09:00:00Z", // Completed appointment
      time: "09:00 AM",
      platform: "Google Meet",
      status: "Completed",
    },
    {
      id: 4,
      date: "2024-12-09T16:00:00Z", // Completed appointment
      time: "04:00 PM",
      platform: "Teams",
      status: "Completed",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [visibleSection, setVisibleSection] = useState(null); // Track which section is visible

  useEffect(() => {
    setLoading(false);
  }, []);

  // Function to format the date for display
  const formatDayAndDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.toLocaleDateString(undefined, { weekday: "long" });
    const options = { month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString(undefined, options);
    return `${day}, ${formattedDate}`;
  };

  // Get appointments by their status
  const getAppointmentsByView = (status) => {
    return appointments.filter((appointment) => appointment.status === status);
  };

  // Toggle section visibility
  const toggleSection = (section) => {
    setVisibleSection(visibleSection === section ? null : section);
  };

  // Get an array of dates for the appointments
  const getAppointmentDates = () => {
    return appointments.map(
      (appointment) => new Date(appointment.date).toISOString().split("T")[0]
    );
  };

  return (
    <div className="consultation-page">
      <Sidebar />
      <div className="content">
        <Box m="2px">
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
                                    {formatDayAndDate(appointment.date)}
                                  </div>
                                  <div className="details-box">
                                    <p>Time: {appointment.time}</p>
                                    <p>Platform: {appointment.platform}</p>
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
                                    {formatDayAndDate(appointment.date)}
                                  </div>
                                  <div className="details-box">
                                    <p>Time: {appointment.time}</p>
                                    <p>Platform: {appointment.platform}</p>
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
            <Box flex="1 1 50%" ml="10px">
              <FullCalendar
                height="80vh"
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
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
              />
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Consultation;
