import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar";
import Topbar from "../Topbar";
import Header from "../../components/Header";
import "./calendar.css";

const Calendar = () => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [fetchedAppointments, setFetchedAppointments] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [popup, setPopup] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const navigate = useNavigate();

  // Fetch appointments from the backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:8081/appointments", {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Format appointments for FullCalendar
        const formattedAppointments = data
          .map((appointment) => {
            try {
              const cleanedDate = appointment.date.trim();
              const cleanedTime = appointment.time.trim();
              const [year, month, day] = cleanedDate.split("-");
              const [hours, minutes] = cleanedTime.split(":");

              const startDate = new Date(
                parseInt(year, 10),
                parseInt(month, 10) - 1,
                parseInt(day, 10),
                parseInt(hours, 10),
                parseInt(minutes, 10)
              );

              if (isNaN(startDate.getTime())) {
                throw new Error(
                  `Invalid startDate: ${cleanedDate} ${cleanedTime}`
                );
              }

              const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

              return {
                id: appointment.id,
                title: `${appointment.consultationType} with ${appointment.name}`,
                start: startDate,
                end: endDate,
                extendedProps: {
                  email: appointment.email,
                  date: appointment.date,
                  time: appointment.time,
                  contact: appointment.contact,
                  consultationType: appointment.consultationType,
                  additionalInfo: appointment.additionalInfo,
                  platform: appointment.platform,
                },
              };
            } catch (error) {
              console.error("Error formatting appointment:", error);
              return null; // Exclude invalid appointments
            }
          })
          .filter(Boolean); // Remove null values

        setFetchedAppointments(formattedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const handleDateClick = (selected) => {
    setSelectedDate(selected.date); // Store as Date object
  };

  const handleEventClick = (selected) => {
    const { id, start, title } = selected.event;
    setSelectedEventId(id);

    setSelectedDate(new Date(start));
  };

  const handleMouseEnter = (selected) => {
    const { title, start, extendedProps, id } = selected.event;
    setPopup({
      id,
      title,
      start,
      x: selected.jsEvent.clientX,
      y: selected.jsEvent.clientY,
      extendedProps: {
        ...extendedProps,
      },
    });
  };

  const handleMouseLeave = () => {
    // Delay hiding the popup slightly to allow for smooth transitions to the popup itself
    setTimeout(() => {
      setPopup(null);
    }, 100000); // Adjust delay as needed
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleDeleteClick = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/appointments/${selectedAppointmentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.message);

      // Update the frontend by removing the deleted appointment
      setFetchedAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== selectedAppointmentId)
      );

      setDeleteDialogOpen(false);
      setSelectedAppointmentId(null);
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedAppointmentId(null);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };
  const handleAppointmentClick = () => {
    setMenuOpen(false); // Close the menu
    navigate("/appointment"); // Navigate to /appointment
  };
  const handleAvailabilityClick = () => {
    setMenuOpen(false); // Close the menu
    navigate("/availability"); // Navigate to /availability
  };

  return (
    <div>
      <Topbar />
      <Sidebar />
      <div className="content-fullcalendar">
        <Box m="0px">
          <Button
            onClick={handleMenuClick}
            sx={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              backgroundColor: "#1976d2",
              color: "white",
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              fontSize: "24px",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            +
          </Button>
          <div>
            <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
              <MenuItem onClick={handleAppointmentClick}>Appointment</MenuItem>
              <MenuItem onClick={handleAvailabilityClick}>
                Availability
              </MenuItem>
            </Menu>
          </div>
          <Box display="flex">
            {/* Sidebar */}
            {/* for current event */}
            <Box
              flex="1 1 10%"
              sx={{
                p: "15px",
                color: "white",
                background: "lightGray",
                boarderRadius: "6px",
              }}
            >
              <Header
                subtitle={selectedDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              />
              <List>
                {selectedEventId && fetchedAppointments.length > 0 ? (
                  fetchedAppointments
                    .filter(
                      (event) => String(event.id) === String(selectedEventId)
                    )
                    .map((event) => (
                      <ListItem key={event.id} sx={{ mb: 2 }}>
                        <ListItemText
                          primary={event.title}
                          secondary={
                            <>
                              <Typography
                                variant="body2"
                                sx={{ color: "black", fontSize: "0.9rem" }}
                              >
                                <strong>Date:</strong>{" "}
                                {new Date(event.start).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "black", fontSize: "0.9rem" }}
                              >
                                <strong>Time:</strong>{" "}
                                {event.extendedProps.time}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "black", fontSize: "0.9rem" }}
                              >
                                <strong>Email:</strong>{" "}
                                {event.extendedProps.email}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "black", fontSize: "0.9rem" }}
                              >
                                <strong>Contact:</strong>{" "}
                                {event.extendedProps.contact}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "black", fontSize: "0.9rem" }}
                              >
                                <strong>Type:</strong>{" "}
                                {event.extendedProps.consultationType}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "black", fontSize: "0.9rem" }}
                              >
                                <strong>Info:</strong>{" "}
                                {event.extendedProps.additionalInfo}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "black", fontSize: "0.9rem" }}
                              >
                                <strong>Platform:</strong>{" "}
                                {event.extendedProps.platform}
                              </Typography>
                            </>
                          }
                          primaryTypographyProps={{
                            color: "black",
                            fontSize: "1.1rem",
                            fontWeight: "bold",
                          }}
                        />
                      </ListItem>
                    ))
                ) : (
                  <Typography sx={{ mt: 2, color: "black" }}>
                    No event selected.
                  </Typography>
                )}
              </List>
            </Box>

            {/* FullCalendar */}
            <Box flex="1 1 70%" ml="4px">
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
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                eventMouseEnter={handleMouseEnter}
                eventMouseLeave={handleMouseLeave}
                events={fetchedAppointments}
                eventsSet={(events) => setCurrentEvents(events)}
              />
              {/* nag appear kapag tignan appointment sa calendar */}
              {popup && (
                <Box
                  sx={{
                    position: "absolute",
                    top: popup.y + 10,
                    left: popup.x + 10,
                    backgroundColor: "#fff", // Clean white background
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
                    borderRadius: "8px", // Rounded corners for a smooth, professional feel
                    padding: "14px", // Reduced internal padding for a minimalist design
                    zIndex: 1000, // Ensure it sits on top of other elements
                    width: "300px", // Control the width of the box
                    border: "2px solid #e0e0e0", // Light border for subtle contrast
                    display: "flex",
                    flexDirection: "column", // Stack content vertically
                  }}
                  onMouseEnter={() => clearTimeout()} // Prevent hiding on mouse enter
                  onMouseLeave={() => setPopup(null)} // Hide popup when mouse leaves
                >
                  {/* Title (Name) */}
                  <Typography
                    variant="h6"
                    sx={{
                      marginBottom: "12px", // Space below the title
                      color: "#333", // Dark text for contrast
                      fontSize: "16px", // Slightly smaller title for a minimalist look
                    }}
                  >
                    {popup.title} {/* Name */}
                  </Typography>

                  {/* Time */}
                  <Box
                    sx={{
                      marginBottom: "12px", // Space below the time section
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "14px", color: "#666" }}
                    >
                      ⏰{popup.extendedProps.time}
                    </Typography>
                  </Box>

                  {/* Platform (Place) */}
                  <Box
                    sx={{
                      marginBottom: "16px", // Space below the platform section
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "14px", color: "#666" }}
                    >
                      🌐{" "}
                      {(() => {
                        switch (popup.platform) {
                          case "zoom":
                            return "Zoom";
                          case "teams":
                            return "MS Teams";
                          case "googleMeet":
                            return "Google Meet";
                          case "phone":
                            return "Phone Call";
                          default:
                            return "In person";
                        }
                      })()}{" "}
                      {/* Place */}
                    </Typography>
                  </Box>

                  {/* Button Section */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end", // Align button to the right
                      marginTop: "16px", // Space above button
                    }}
                  >
                    <button
                      style={{
                        backgroundColor: "#003366", // Dark blue for the button
                        color: "#fff", // White text for contrast
                        border: "none", // Remove border
                        padding: "8px 12px", // Comfortable padding for a minimalist look
                        borderRadius: "4px", // Rounded corners for a smooth feel
                        cursor: "pointer", // Pointer cursor on hover
                        fontWeight: "bold", // Bold text for visibility
                        fontSize: "14px", // Smaller font size for consistency
                        transition: "background-color 0.3s", // Smooth background color transition
                      }}
                      onClick={() => handleDeleteClick(popup.id)}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#002244")
                      } // Darker blue on hover
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "#003366")
                      } // Revert back to original blue
                    >
                      Delete
                    </button>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
          <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
            <DialogTitle
              sx={{
                fontWeight: "bold",
                fontSize: "18px",
                color: "#333", // Dark text for the title
                paddingBottom: "10px",
              }}
            >
              Confirm Deletion
            </DialogTitle>
            <DialogContent
              sx={{
                fontSize: "13px",
                color: "black", // Neutral text color for the content
                paddingBottom: "20px",
              }}
            >
              Are you sure you want to delete this appointment? This action
              cannot be undone.
            </DialogContent>
            <DialogActions
              sx={{
                padding: "12px", // Add padding for a balanced layout
                justifyContent: "flex-end", // Align buttons to the right
              }}
            >
              <Button
                onClick={cancelDelete}
                sx={{
                  backgroundColor: "#003366", // Dark blue button background
                  color: "#fff", // White text
                  borderRadius: "4px",
                  fontWeight: "bold",
                  fontSize: "12px", // Small font size for a compact look
                  padding: "8px 16px", // Comfortable padding for buttons
                  "&:hover": {
                    backgroundColor: "#002244", // Darker blue on hover
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                color="error"
                sx={{
                  backgroundColor: "#003366", // Dark blue button background
                  color: "#fff", // White text
                  borderRadius: "4px",
                  fontWeight: "bold",
                  fontSize: "12px",
                  padding: "8px 16px",
                  "&:hover": {
                    backgroundColor: "#002244", // Darker blue on hover
                  },
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </div>
    </div>
  );
};

export default Calendar;
