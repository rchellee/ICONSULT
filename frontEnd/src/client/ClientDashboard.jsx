import React, { useEffect, useState } from "react";
import Sidebar from "../client/sidebar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./client.css";

function ClientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  // Fetch appointments from the API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const clientId = localStorage.getItem("clientId");
        if (!clientId) {
          console.error("Client ID not found!");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:8081/appointments/client/${clientId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Filter appointments for the selected date
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

  return (
    <div className="client-home-page">
      <Sidebar />
      <div className="content">
        <h1>Dashboard</h1>

        {loading ? (
          <p>Loading appointments...</p>
        ) : (
          <>
            {/* Calendar Section */}
            <div className="calendar-section">
              <h2>Appointment Calendar</h2>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={({ date }) => {
                  const appointmentDates = appointments.map((appointment) =>
                    new Date(appointment.date).toDateString()
                  );
                  return appointmentDates.includes(date.toDateString())
                    ? "highlight"
                    : null;
                }}
              />
            </div>

            {/* Today's Appointments */}
            <div className="appointment-list">
              <h3>Appointments for Today</h3>
              {filteredAppointments.length > 0 ? (
                <ul>
                  {filteredAppointments.map((appointment, index) => (
                    <li key={index} className="appointment-item">
                      <div className="date-box">
                        <strong>{formatDayAndDate(appointment.date)}</strong>
                      </div>
                      <div className="details-box">
                        <p>
                          <strong>Time:</strong> {appointment.time}
                        </p>
                        <p>
                          <strong>Consultation Type:</strong>{" "}
                          {appointment.consultationType}
                        </p>
                        <p>
                          <strong>Platform:</strong> {appointment.platform}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No appointments for today.</p>
              )}
            </div>

            {/* All Appointments */}
            <div className="all-appointments">
              <h3>All Appointments</h3>
              {appointments.length > 0 ? (
                <ul>
                  {appointments.map((appointment, index) => (
                    <li key={index} className="appointment-item">
                      <div className="date-box">
                        <strong>{formatDayAndDate(appointment.date)}</strong>
                      </div>
                      <div className="details-box">
                        <p>
                          <strong>Time:</strong> {appointment.time}
                        </p>
                        <p>
                          <strong>Consultation Type:</strong>{" "}
                          {appointment.consultationType}
                        </p>
                        <p>
                          <strong>Platform:</strong> {appointment.platform}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No appointments available.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ClientDashboard;
