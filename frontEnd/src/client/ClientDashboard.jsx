import React, { useEffect, useState } from "react";
import Sidebar from "../client/sidebar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Make sure to import this for default styles
import "./client.css";

function ClientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentAppointmentIndex, setCurrentAppointmentIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredAppointments, setFilteredAppointments] = useState([]);

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
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingAppointments = data.filter((appointment) => {
          const appointmentDate = new Date(appointment.date);
          return appointmentDate >= today;
        });

        const sortedAppointments = upcomingAppointments.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        });

        setAppointments(sortedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

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

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const handlePreviousAppointment = () => {
    if (currentAppointmentIndex > 0) {
      setCurrentAppointmentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNextAppointment = () => {
    if (currentAppointmentIndex < appointments.length - 1) {
      setCurrentAppointmentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const currentAppointment = appointments[currentAppointmentIndex];

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
              {/* <div className="calendar-container"> */}
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

              {/* Filtered Appointments */}
              <div className="appointment-list">
                <h3>Appointments on {formatDate(selectedDate.toISOString())}</h3>
                {filteredAppointments.length > 0 ? (
                  <ul>
                    {filteredAppointments.map((appointment, index) => (
                      <li key={index}>
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
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No appointments on this day.</p>
                )}
              </div>
          

         
          </>
        )}
      </div>
    </div>
  );
}

export default ClientDashboard;
