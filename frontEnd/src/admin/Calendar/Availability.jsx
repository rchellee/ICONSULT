import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar"; // Import the Sidebar component
import "./calendar.css";
import Select from "./DynamicCalendar";

function Availability() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: "",
    time: "", 
  });

  const generateRandomAvailability = () => {
    const today = new Date();
    const dates = {};
    for (let i = 0; i < 60; i++) {
      // Current and next month
      const date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + i
      );
      const dateStr = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const rand = Math.random();
      if (rand < 0.3) {
        dates[dateStr] = "available";
      } else if (rand < 0.6) {
        dates[dateStr] = "fullyBooked";
      }
    }
    return dates;
  };

  const [availableDates] = useState(generateRandomAvailability());

  const times = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ];
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setFormData({ ...formData, date });
    setAvailableTimes(times); // Adjust dynamically if necessary
  };

  const handleTimeSelect = (time) => {
    setFormData({ ...formData, time });
  };

  return (
    <div className="appointment-form-container">
      <Sidebar />
      <div className="content">
        <div className="calendar-time-container">
          <Select
            availableDates={availableDates}
            onDateSelect={handleDateSelect}
          />
          {selectedDate && (
            <div className="time-slots">
              <h4>Available Times for {selectedDate}</h4>
              {availableTimes.map((time) => (
                <button
                  key={time}
                  className={`time-slot ${
                    formData.time === time ? "selected" : ""
                  }`}
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Availability;
