import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Sidebar from "../sidebar";
import "./Availability.css";

const localizer = momentLocalizer(moment);

// Custom Toolbar component with navigation
function CustomToolbar({ label, onNavigate }) {
  return (
    <div className="custom-toolbar">
      <h2>{label}</h2>
      <button onClick={() => onNavigate("TODAY")}>Today</button>
      <button onClick={() => onNavigate("PREV")}>{"<"}</button>
      <button onClick={() => onNavigate("NEXT")}>{">"}</button>
    </div>
  );
}

function Event({ event }) {
  return (
    <div
      style={{
        backgroundColor: "#3174ad",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        border: "none",
        opacity: 0.9,
        maxWidth: "150px",
        wordBreak: "break-all",
      }}
    >
      {event.title}
      {/* <br />
      {event.description && <p>Description: {event.description}</p>}
      {event.platform && <p>Platform: {event.platform}</p>}
      {event.email && <p>Email: {event.email}</p>}
      {event.contact && <p>Contact: {event.contact}</p>}
      <p>Date: {event.start.toLocaleDateString()}</p>
      <p>Time: {event.start.toLocaleTimeString()}</p> */}
    </div>
  );
}

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDateAppointments, setSelectedDateAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:8081/appointments", {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        console.log("Received appointments:", data);

        const formattedAppointments = data.map((appointment) => {
          console.log("Raw appointment:", appointment); // Log each raw appointment

          // Parse date and time separately
          const dateParts = appointment.date.split("-");
          const year = parseInt(dateParts[0], 10);
          const month = parseInt(dateParts[1], 10) - 1; // Months are zero-indexed in JavaScript
          const day = parseInt(dateParts[2], 10);

          const timeParts = appointment.time.split(":");
          const hours = parseInt(timeParts[0], 10);
          const minutes = parseInt(timeParts[1], 10);

          // Create Date object
          const startDate = new Date(year, month, day, hours, minutes);
          console.log("Start date:", startDate); // Log the start date

          if (isNaN(startDate.getTime())) {
            console.error(
              "Invalid start date:",
              appointment.date,
              appointment.time
            );
            return null; // Skip this appointment if the start date is invalid
          }

          const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
          console.log("End date:", endDate); // Log the end date

          return {
            id: appointment.id,
            title: `${appointment.consultationType} with ${appointment.name}`,
            start: startDate,
            end: endDate,
            description: appointment.additionalInfo,
            platform: appointment.platform,
            email: appointment.email,
            contact: appointment.contact,
          };
        });

        console.log(
          "Formatted appointments:",
          formattedAppointments.filter((app) => app !== null)
        );

        setAppointments(formattedAppointments.filter((app) => app !== null));
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleDateClick = (slotInfo) => {
    const selectedDate = moment(slotInfo.start).startOf("day").toDate();
    setSelectedDate(selectedDate);

    const filteredAppointments = appointments.filter((appointment) =>
      moment(appointment.start).isSame(selectedDate, "day")
    );

    setSelectedDateAppointments(filteredAppointments);
  };

  const handleEventClick = (event) => {
    setSelectedDate(moment(event.start).startOf("day").toDate());
    setSelectedDateAppointments([event]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="calendar-wrapper">
      <Sidebar />
      <div className="content">
        <div className="calendar-container">
          <Calendar
            localizer={localizer}
            events={appointments}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            components={{
              toolbar: (props) => <CustomToolbar {...props} />,
              event: Event,
            }}
            views={["month", "week", "day"]}
            defaultView="month"
            selectable
            onSelectEvent={(event) => handleEventClick(event)}
            onSelectSlot={(slotInfo) => handleDateClick(slotInfo)}
          />
        </div>
        <div className="appointment-details">
          {selectedDate && (
            <h3>
              Appointments for {moment(selectedDate).format("MMMM Do, YYYY")}
            </h3>
          )}
          {selectedDateAppointments.length > 0 ? (
            selectedDateAppointments.map((appointment) => (
              <div key={appointment.id} className="appointment-card">
                <h4>{appointment.title}</h4>
                <p>
                  <strong>Time:</strong>{" "}
                  {moment(appointment.start).format("h:mm A")}
                </p>
                <p>
                  <strong>Description:</strong> {appointment.description}
                </p>
                <p>
                  <strong>Platform:</strong> {appointment.platform}
                </p>
                <p>
                  <strong>Contact:</strong> {appointment.contact}
                </p>
              </div>
            ))
          ) : (
            <p>No appointments on this date.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Appointments;
