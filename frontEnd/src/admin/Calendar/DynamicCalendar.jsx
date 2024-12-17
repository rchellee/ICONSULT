import React, { useEffect, useState } from "react";
import "./appointment.css";

const DynamicCalendar = ({ availableDates, onDateSelect }) => {
  const [currDate, setCurrDate] = useState(new Date());
  const [days, setDays] = useState([]);

  const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December",
  ];

  const renderCalendar = () => {
    const year = currDate.getFullYear();
    const month = currDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    const lastDayOfMonth = new Date(year, month, lastDateOfMonth).getDay();
    const lastDateOfPrevMonth = new Date(year, month, 0).getDate();

    const calendarDays = [];

    // Previous month's dates (fill-in for the first week)
    for (let i = firstDayOfMonth; i > 0; i--) {
      calendarDays.push({
        date: lastDateOfPrevMonth - i + 1,
        currentMonth: false,
      });
    }

    // Current month's dates
    for (let i = 1; i <= lastDateOfMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const status = availableDates[dateStr] || null; // Get status if defined
      calendarDays.push({
        date: i,
        currentMonth: true,
        available: status === "available",
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
      const newDate = new Date(prev.getFullYear(), prev.getMonth() + direction, 1);
      return newDate;
    });
  };

  const isPrevDisabled =
    currDate.getFullYear() === new Date().getFullYear() &&
    currDate.getMonth() === new Date().getMonth();

  const isNextDisabled =
    currDate.getFullYear() === new Date().getFullYear() &&
    currDate.getMonth() === new Date().getMonth() + 1;

  useEffect(() => {
    renderCalendar();
  }, [currDate, availableDates]);

  return (
    <div className="wrapper">
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
                    ? "available"
                    : day.fullyBooked
                    ? "fully-booked"
                    : "unavailable"
                  : "inactive"
              }`}
              onClick={() =>
                day.currentMonth && day.available && onDateSelect(day.dateStr)
              }
            >
              {day.date}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DynamicCalendar;
