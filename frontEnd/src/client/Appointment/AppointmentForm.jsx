// AppointmentForm.jsx
import React, { useState, useEffect } from 'react';

function AppointmentForm({ onSubmit, existingAppointment }) {
    const [formData, setFormData] = useState({
        id: '',
        consultantId: '',
        clientId: '',
        status: '',
        date: '',
        time: ''
    });

    // If an existing appointment is passed, populate the form
    useEffect(() => {
        if (existingAppointment) {
            setFormData(existingAppointment);
        }
    }, [existingAppointment]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        // Reset form after submit
        setFormData({
            id: '',
            consultantId: '',
            clientId: '',
            status: '',
            date: '',
            time: ''
        });
    };

    return (
        <form className="appointment-form" onSubmit={handleSubmit}>
            <div>
                <label>ID</label>
                <input type="text" name="id" value={formData.id} onChange={handleChange} disabled={!!existingAppointment} />
            </div>
            <div>
                <label>Consultant ID</label>
                <input type="text" name="consultantId" value={formData.consultantId} onChange={handleChange} />
            </div>
            <div>
                <label>Client ID</label>
                <input type="text" name="clientId" value={formData.clientId} onChange={handleChange} />
            </div>
            <div>
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    
                </select>
            </div>
            <div>
                <label>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} />
            </div>
            <div>
                <label>Time</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} />
            </div>
            <button type="submit">{existingAppointment ? 'Update Appointment' : 'Add Appointment'}</button>
        </form>
    );
}

export default AppointmentForm;
