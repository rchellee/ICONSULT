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
    if (
      window.confirm(
        `Are you sure you want to delete the event '${selected.event.title}'`
      )
    ) {
      selected.event.remove();
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="content">
        <Box m="20px">
          <Header title="Calendar" subtitle="Events" />
          <Box display="flex">
            {/* Sidebar */}
            <Box
              flex="1 1 20%"
              sx={{
                background: "#395176", // Set the background color here
                p: "15px",
                borderRadius: "4px",
                color: "white",
              }}
            >
              <Typography variant="h7">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </Typography>
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
                          margin: "10px 0",
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
                events={fetchedAppointments} // Use fetched appointments
                eventsSet={(events) => setCurrentEvents(events)}
              />
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Calendar;
