import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../client/sidebar";
import "./client.css";

function ClientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentAppointmentIndex, setCurrentAppointmentIndex] = useState(0);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Replace with the logged-in user's ID from session or context
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
        today.setHours(0, 0, 0, 0); // Reset time to 00:00:00 for comparison

        // Filter out past appointments
        const upcomingAppointments = data.filter((appointment) => {
          const appointmentDate = new Date(appointment.date);
          return appointmentDate >= today;
        });

        // Sort appointments by date
        const sortedAppointments = upcomingAppointments.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB; // Ascending order
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
        <div className="button-container">
          <Link to="/appointments/new" className="new-appointment-button">
            <button>+ Add New Appointment</button>
          </Link>
        </div>

        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length > 0 ? (
          <div className="appointment-viewer">
            <h2>Your Appointments</h2>
            {currentAppointment && (
              <div className="appointment-details">
                <p>
                  <strong>Date:</strong> {formatDate(currentAppointment.date)}
                </p>
                <p>
                  <strong>Time:</strong> {currentAppointment.time}
                </p>
                <p>
                  <strong>Consultation Type:</strong>{" "}
                  {currentAppointment.consultationType}
                </p>
                <p>
                  <strong>Platform:</strong> {currentAppointment.platform}
                </p>
              </div>
            )}
            <div className="navigation-buttons">
              <button
                onClick={handlePreviousAppointment}
                disabled={currentAppointmentIndex === 0}
              >
                {"< Previous"}
              </button>
              <button
                onClick={handleNextAppointment}
                disabled={currentAppointmentIndex === appointments.length - 1}
              >
                {"Next >"}
              </button>
            </div>
            <p>
              Viewing appointment {currentAppointmentIndex + 1} of{" "}
              {appointments.length}
            </p>
          </div>
        ) : (
          <p>No appointments yet. Add one above!</p>
        )}
      </div>
    </div>
  );
}

export default ClientDashboard;
