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
    const title = prompt("Add Schedule");
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: `${selected.dateStr}-${title}`,
        title,
        start: selected.startStr,
        end: selected.endStr,
        allDay: selected.allDay,
      });
    }
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
          <Header title="Calendar" subtitle="Manage your Schedule" />
          <Box display="flex" >
            {/* Sidebar */}
            <Box
              flex="1 1 60%"
              backgroundColor={colors.primary[400]}
              p="15px"
              borderRadius="4px"
            >
              <Typography variant="h5">Todays' Events</Typography>
              <List>
                {fetchedAppointments
                  .filter((event) => {
                    const today = new Date();
                    return (
                      event.start.getFullYear() === today.getFullYear() &&
                      event.start.getMonth() === today.getMonth() &&
                      event.start.getDate() === today.getDate()
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
                  ))}
              </List>
            </Box>

            {/* FullCalendar */}
            <Box  flex="1 1 160%" ml="100px">
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
                select={handleDateClick}
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
