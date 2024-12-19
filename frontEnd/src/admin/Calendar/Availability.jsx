import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar";
import "./calendar.css";
import Select from "./AvailableCalendar";

function Availability() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dates: [], // Store selected dates
    times: {}, // Store times as { date: { start: "", end: "" } }
  });

  const generateAllDates = () => {
    const today = new Date();
    const dates = {};
    for (let i = 0; i < 60; i++) {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      dates[dateStr] = "available";
    }
    return dates;
  };

  const [availableDates] = useState(generateAllDates());

  const handleDateSelect = (date) => {
    setFormData((prevState) => {
      const dates = prevState.dates.includes(date)
        ? prevState.dates.filter((d) => d !== date)
        : [...prevState.dates, date];

      const times = { ...prevState.times };
      dates.forEach((selectedDate) => {
        if (!times[selectedDate]) {
          times[selectedDate] = { start: "", end: "" }; // Initialize start and end times
        }
      });

      return { ...prevState, dates, times };
    });
  };

  const handleTimeSelect = (date, type, value) => {
    setFormData((prevState) => ({
      ...prevState,
      times: {
        ...prevState.times,
        [date]: {
          ...prevState.times[date],
          [type]: value, // Update start or end time
        },
      },
    }));
  };

  const handleSubmit = () => {
    const allValid = formData.dates.every(
      (date) => formData.times[date]?.start && formData.times[date]?.end
    );

    if (!allValid) {
      alert("Please select start and end times for each selected date.");
      return;
    }

    console.log("Selected Availability:", formData);
    alert("Your availability has been submitted!");
  };

  return (
    <div className="appointment-form-container">
      <Sidebar />
      <div className="content">
        <div className="calendar-time-container">
          <Select
            availableDates={availableDates}
            onDateSelect={handleDateSelect}
            selectedDates={formData.dates}
          />
        </div>

        <div className="selected-dates">
          <h4>Dates</h4>
          {formData.dates.map((date) => (
            <div key={date} className="selected-date-item">
              <p>{date}</p>
              <div className="time-selectors">
                <select
                  value={formData.times[date]?.start || ""}
                  onChange={(e) => handleTimeSelect(date, "start", e.target.value)}
                >
                  <option value="" disabled>
                    Start Time
                  </option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                </select>

                <span>—</span>

                <select
                  value={formData.times[date]?.end || ""}
                  onChange={(e) => handleTimeSelect(date, "end", e.target.value)}
                >
                  <option value="" disabled>
                    End Time
                  </option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                  <option value="07:00 PM">07:00 PM</option>
                </select>
              </div>
            </div>
          ))}

          {formData.dates.length > 0 && (
            <button className="submit-button" onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Availability;
