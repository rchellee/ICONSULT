// Dashboard.jsx
import React, { useState } from 'react';
import Sidebar from '../sidebar';
import AppointmentForm from './AppointmentForm';

function Appointment() {
    const [appointments, setAppointments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null); // State to hold the appointment being edited

    const handleAddAppointment = (appointment) => {
        if (editingAppointment) {
            // Update the existing appointment
            setAppointments(
                appointments.map((appt) =>
                    appt.id === appointment.id ? appointment : appt
                )
            );
            setEditingAppointment(null); // Reset editing state
        } else {
            // Add a new appointment
            setAppointments([...appointments, appointment]);
        }
        setShowForm(false); // Hide form after submit
    };

    const toggleFormVisibility = () => {
        setShowForm(!showForm);
    };

    const handleEditAppointment = (appointment) => {
        setEditingAppointment(appointment);
        setShowForm(true); // Show the form when editing
    };

    return (
        <div className="dashboard-page">
            <Sidebar /> {/* Sidebar sa gilid */}
            <div className="dashboard-content">
                <h2>Dashboard</h2>

                <div className="appointment-section">
                    <button onClick={toggleFormVisibility}>
                        {showForm ? "Cancel" : "Add Appointment"}
                    </button>

                    {showForm && (
                        <div className="appointment-form-container">
                            <h3>{editingAppointment ? 'Edit Appointment' : 'Add New Appointment'}</h3>
                            <AppointmentForm
                                onSubmit={handleAddAppointment}
                                existingAppointment={editingAppointment}
                            />
                        </div>
                    )}
                </div>

                {!showForm && (
                    <div className="section">
                        <h3>Upcoming Appointments</h3>
                        {appointments.length > 0 ? (
                            <ul>
                                {appointments.map((appt, index) => (
                                    <li key={index}>
                                        {appt.date} at {appt.time} - {appt.status}
                                        <button onClick={() => handleEditAppointment(appt)}>Edit</button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No upcoming appointments. Schedule one now!</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Appointment;
