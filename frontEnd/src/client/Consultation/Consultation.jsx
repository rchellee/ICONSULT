import React, { useEffect, useState } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  Typography,
  useTheme,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Sidebar from "../sidebar";
import { Link } from "react-router-dom";
import "./consultation.css";

const Consultation = () => {
  const theme = useTheme();
  const [appointments, setAppointments] = useState([]);
  const [clientId, setClientId] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visibleSection, setVisibleSection] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    const storedClientId = localStorage.getItem("clientId");
    if (storedClientId) {
      setClientId(storedClientId);
      fetchAppointments(storedClientId);
    }
  }, []);

  const fetchAppointments = async (clientId) => {
    try {
      const response = await axios.get("http://localhost:8081/appointments");
      const filteredAppointments = response.data.filter(
        (appointment) => appointment.client_id === parseInt(clientId)
      );
      setAppointments(filteredAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleDeleteClick = (appointmentId) => {
    if (appointments.some((appointment) => appointment.id === appointmentId)) {
      setSelectedAppointmentId(appointmentId);
      setDeleteDialogOpen(true);
    } else {
      alert("Invalid appointment ID.");
    }
  };

  const confirmDelete = async () => {
    if (!selectedAppointmentId) {
      alert("Invalid appointment ID.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8081/appointments/${selectedAppointmentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete appointment");
      }

      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== selectedAppointmentId)
      );

      setDeleteDialogOpen(false);
      setSelectedAppointmentId(null);
    } catch (error) {
      console.error("Error deleting appointment:", error.message);
      alert(`Failed to delete appointment: ${error.message}`);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedAppointmentId(null);
  };

  const formatDayAndDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.toLocaleDateString(undefined, { weekday: "long" });
    const options = { month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString(undefined, options);
    return `${day}, ${formattedDate}`;
  };

  const getAppointmentsByView = (status) => {
    const today = new Date();

    const sortedAppointments = appointments
      .filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        if (status === "Upcoming") {
          return appointmentDate >= today; 
        } else if (status === "Completed") {
          return appointmentDate < today; 
        }
        return false;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    if (status === "Completed") {
      return sortedAppointments.slice(-3);
    }

    return sortedAppointments;
  };

  const toggleSection = (section) => {
    setVisibleSection(visibleSection === section ? null : section);
  };

  const mapAppointmentsToEvents = () => {
    return appointments.map((appointment) => {
      console.log("Fetched Appointment ID:", appointment.id);
      return {
        title: `Consultation - ${appointment.consultationType}`,
        start: appointment.date,
        allDay: true,
        extendedProps: {
          id: appointment.id,
          time: appointment.time,
          platform: appointment.platform,
          name: appointment.name,
          email: appointment.email,
          contact: appointment.contact,
          companyName: appointment.companyName,
          reminder: appointment.reminder,
        },
      };
    });
  };

  const handleMouseEnter = (selected) => {
    const { title, extendedProps } = selected.event;
    setPopup({
      title,
      time: extendedProps.time,
      id: extendedProps.id, // Add the id here to ensure it's available in the popup
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
                              {getAppointmentsByView("Upcoming").map(
                                (appointment, index) => (
                                  <li key={index} className="appointment-item">
                                    <div className="date-box">
                                      {formatDayAndDate(appointment.date)} at{" "}
                                      {appointment.time}
                                    </div>
                                    <div className="details-box">
                                      <p>
                                        <strong>Email:</strong>{" "}
                                        {appointment.email}
                                      </p>
                                      <p>
                                        <strong>Contact:</strong>{" "}
                                        {appointment.contact}
                                      </p>
                                      <p>
                                        <strong>Type:</strong>{" "}
                                        {appointment.consultationType}
                                      </p>
                                      <p>
                                        <strong>Platform:</strong>{" "}
                                        {appointment.platform}
                                      </p>
                                      <p>
                                        <strong>Company:</strong>{" "}
                                        {appointment.companyName}
                                      </p>
                                    </div>
                                  </li>
                                )
                              )}
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
                              {getAppointmentsByView("Completed").map(
                                (appointment, index) => (
                                  <li key={index} className="appointment-item">
                                    <div className="date-box">
                                      {formatDayAndDate(appointment.date)} at{" "}
                                      {appointment.time}
                                    </div>
                                    <div className="details-box">
                                      <p>
                                        <strong>Type:</strong>{" "}
                                        {appointment.consultationType}
                                      </p>
                                      <p>
                                        <strong>Platform:</strong>{" "}
                                        {appointment.platform}
                                      </p>
                                    </div>
                                  </li>
                                )
                              )}
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
                    <Button
                      onClick={() => handleDeleteClick(popup.id)}
                      color="error"
                      variant="contained"
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
          <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this appointment? This action
              cannot be undone.
            </DialogContent>
            <DialogActions>
              <Button onClick={cancelDelete}>Cancel</Button>
              <Button onClick={confirmDelete} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </div>
    </div>
  );
};

export default Consultation;
