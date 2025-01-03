import React, { useEffect, useState } from "react";
import "./calendar.css";

const AvailableCalendar = ({ availableDates, onDateSelect }) => {
  const [currDate, setCurrDate] = useState(new Date());
  const [days, setDays] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]); // Track multiple selected dates

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const renderCalendar = () => {
    const year = currDate.getFullYear();
    const month = currDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    const lastDayOfMonth = new Date(year, month, lastDateOfMonth).getDay();
    const lastDateOfPrevMonth = new Date(year, month, 0).getDate();

    const calendarDays = [];
    const today = new Date();

    // Previous month's dates (fill-in for the first week)
    for (let i = firstDayOfMonth; i > 0; i--) {
      calendarDays.push({
        date: lastDateOfPrevMonth - i + 1,
        currentMonth: false,
      });
    }

    // Current month's dates
    for (let i = 1; i <= lastDateOfMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        i
      ).padStart(2, "0")}`;
      const status = availableDates[dateStr] || null; // Get status if defined
      const isPastDate = new Date(year, month, i) < today; // Check if the date is in the past

      calendarDays.push({
        date: i,
        currentMonth: true,
        available: !isPastDate, // Dates in the past are not available
        fullyBooked: status === "fullyBooked",
        dateStr,
      });
    }

    // Next month's dates (fill-in for the last week)
    for (let i = 1; lastDayOfMonth + i <= 6; i++) {
      calendarDays.push({ date: i, currentMonth: false });
    }

    setDays(calendarDays);
  };

  const changeMonth = (direction) => {
    setCurrDate((prev) => {
      const newDate = new Date(
        prev.getFullYear(),
        prev.getMonth() + direction,
        1
      );
      return newDate;
    });
  };

  const isPrevDisabled =
    currDate.getFullYear() === new Date().getFullYear() &&
    currDate.getMonth() === new Date().getMonth();

  const isNextDisabled =
    currDate.getFullYear() === new Date().getFullYear() &&
    currDate.getMonth() === new Date().getMonth() + 1;

  const handleDateClick = (dateStr) => {
    setSelectedDates((prevSelectedDates) => {
      // If the date is already selected, remove it; otherwise, add it
      if (prevSelectedDates.includes(dateStr)) {
        return prevSelectedDates.filter((date) => date !== dateStr);
      } else {
        return [...prevSelectedDates, dateStr];
      }
    });

    onDateSelect(dateStr); // Trigger the callback with the selected date
  };

  useEffect(() => {
    renderCalendar();
  }, [currDate, availableDates]);

  return (
    <div className="wrapper-admin">
      <header>
        <p className="current-date">
          {months[currDate.getMonth()]} {currDate.getFullYear()}
        </p>
        <div className="icons">
          <button
            onClick={() => changeMonth(-1)}
            disabled={isPrevDisabled}
            className={isPrevDisabled ? "disabled-icon" : ""}
          >
            {"<"}
          </button>
          <button
            onClick={() => changeMonth(1)}
            disabled={isNextDisabled}
            className={isNextDisabled ? "disabled-icon" : ""}
          >
            {">"}
          </button>
        </div>
      </header>
      <div className="calendar">
        <ul className="weeks">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <li key={day}>{day}</li>
          ))}
        </ul>
        <ul className="days">
          {days.map((day, index) => (
            <li
              key={index}
              className={`${
                day.currentMonth
                  ? day.available
                    ? selectedDates.includes(day.dateStr)
                      ? "selected"
                      : "available"
                    : day.fullyBooked
                    ? "fully-booked"
                    : "inactive" // For past or unavailable dates
                  : "inactive" // For out-of-month dates
              }`}
              onClick={() => {
                if (day.currentMonth && day.available) {
                  handleDateClick(day.dateStr);
                }
              }}
              style={{
                backgroundColor: selectedDates.includes(day.dateStr)
                  ? "#85a8ee" // Selected date background color
                  : "#fbfbfb", // Original background color for available dates
                color: day.currentMonth && !day.available ? "#aaa" : "inherit", // Gray for inactive dates
              }}
            >
              {day.date}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AvailableCalendar;
