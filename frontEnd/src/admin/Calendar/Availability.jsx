import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Sidebar from "../sidebar";
import "./Availability.css";

const localizer = momentLocalizer(moment);

// Custom Toolbar component
function CustomToolbar({ label }) {
  return (
    <div className="custom-toolbar">
      <h2>{label}</h2>
    </div>
  );
}

function Event({ event }) {
  return (
    <div style={{
      backgroundColor: '#3174ad',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      border: 'none',
      opacity: 0.9,
      maxWidth: '200px', 
      wordBreak: 'break-all',
    }}>
      <strong>{event.title}</strong><br />
      {event.description && <p>Description: {event.description}</p>}
      {event.platform && <p>Platform: {event.platform}</p>}
      {event.email && <p>Email: {event.email}</p>}
      {event.contact && <p>Contact: {event.contact}</p>}
      <p>Date: {event.start.toLocaleDateString()}</p>
      <p>Time: {event.start.toLocaleTimeString()}</p>
    </div>
  );
}

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch("http://localhost:8081/appointments", { method: 'GET' });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
  
        console.log('Received appointments:', data); 
  
        const formattedAppointments = data.map((appointment) => {
          console.log('Raw appointment:', appointment); // Log each raw appointment
          
          // Parse date and time separately
          const dateParts = appointment.date.split('-');
          const year = parseInt(dateParts[0], 10);
          const month = parseInt(dateParts[1], 10) - 1; // Months are zero-indexed in JavaScript
          const day = parseInt(dateParts[2], 10);
          
          const timeParts = appointment.time.split(':');
          const hours = parseInt(timeParts[0], 10);
          const minutes = parseInt(timeParts[1], 10);
  
          // Create Date object
          const startDate = new Date(year, month, day, hours, minutes);
          console.log('Start date:', startDate); // Log the start date
          
          if (isNaN(startDate.getTime())) {
            console.error('Invalid start date:', appointment.date, appointment.time);
            return null; // Skip this appointment if the start date is invalid
          }
  
          const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
          console.log('End date:', endDate); // Log the end date
  
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
  
        console.log('Formatted appointments:', formattedAppointments.filter(app => app !== null)); 
  
        setAppointments(formattedAppointments.filter(app => app !== null));
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAppointments();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="calendar-wrapper">
      <Sidebar />
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          components={{
            toolbar: CustomToolbar,
            event: Event,
          }}
          views={['month', 'week', 'day']}
          defaultView='month'
        />
      </div>
    </div>
  );
}

export default Appointments;