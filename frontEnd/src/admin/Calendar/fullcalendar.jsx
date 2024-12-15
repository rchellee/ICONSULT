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
import "./calendar.css";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [fetchedAppointments, setFetchedAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [popup, setPopup] = useState(null);

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
    const { title, start, end, extendedProps } = selected.event;
    setPopup({
      title,
      start,
      end,
      email: extendedProps.email,
      contact: extendedProps.contact,
      consultationType: extendedProps.consultationType,
      additionalInfo: extendedProps.additionalInfo,
      platform: extendedProps.platform,
      x: selected.jsEvent.clientX,
      y: selected.jsEvent.clientY,
    });
  };

  const handleMouseEnter = (selected) => {
    const { title, start, end, extendedProps } = selected.event;
    setPopup({
      title,
      start,
      end,
      email: extendedProps.email,
      contact: extendedProps.contact,
      consultationType: extendedProps.consultationType,
      additionalInfo: extendedProps.additionalInfo,
      platform: extendedProps.platform,
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
    <div>
      <Sidebar />
      <div className="content">
        <Box m="20px">
          <Header title="Calendar" subtitle={selectedDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })} />
          <Box display="flex">
            {/* Sidebar */}
            <Box
              flex="1 1 10%"
              sx={{
                background: "#395176", // Set the background color here
                p: "15px",
                borderRadius: "4px",
                color: "white",
              }}
            >
              <List>
                {fetchedAppointments.filter((event) => {
                  // Convert selectedDate to a Date object
                  const selected = new Date(selectedDate);
                  return (
                    event.start.getFullYear() === selected.getFullYear() &&
                    event.start.getMonth() === selected.getMonth() &&
                    event.start.getDate() === selected.getDate()
                  );
                }).length > 0 ? (
                  fetchedAppointments
                    .filter((event) => {
                      const selected = new Date(selectedDate);
                      return (
                        event.start.getFullYear() === selected.getFullYear() &&
                        event.start.getMonth() === selected.getMonth() &&
                        event.start.getDate() === selected.getDate()
                      );
                    })
                    .map((event) => (
                      <ListItem
                        key={event.id}
                        sx={{
                          backgroundColor: colors.greenAccent[500],
                          margin: "15px 0",
                          borderRadius: "2px",
                        }}
                      >
                        <ListItemText
                          primary={event.title}
                          secondary={new Date(event.start).toLocaleString()}
                        />
                      </ListItem>
                    ))
                ) : (
                  <Typography sx={{ mt: 2 }}>
                    Nothing planned for the day. <br /> Enjoy!
                  </Typography>
                )}
              </List>
            </Box>

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
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                eventMouseEnter={handleMouseEnter}
                eventMouseLeave={handleMouseLeave}
                events={fetchedAppointments} // Use fetched appointments
                eventsSet={(events) => setCurrentEvents(events)}
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
                  <Typography variant="body2">
                    {new Date(popup.start).toLocaleString()} -{" "}
                    {new Date(popup.end).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">Email: {popup.email}</Typography>
                  <Typography variant="body2">Contact: {popup.contact}</Typography>
                  <Typography variant="body2">Type: {popup.consultationType}</Typography>
                  <Typography>Info: {popup.additionalInfo}</Typography>
                  <Typography>Platform: {popup.platform}</Typography>
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

export default Calendar;
