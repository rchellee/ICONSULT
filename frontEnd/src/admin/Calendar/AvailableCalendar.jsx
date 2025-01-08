import React, { useEffect, useState } from "react";
import "./calendar.css";

const AvailableCalendar = ({ availableDates, onDateSelect }) => {
  const [currDate, setCurrDate] = useState(new Date());
  const [days, setDays] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [appointments, setAppointments] = useState([]);

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

  useEffect(() => {
    // Fetch appointments from the backend
    fetch("http://localhost:8081/appointments")
      .then((response) => response.json())
      .then((data) => {
        setAppointments(data);
      })
      .catch((error) => console.error("Error fetching appointments:", error));
  }, []);

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

  const getAppointmentsForDate = (dateStr) => {
    return appointments.filter((appointment) => appointment.date === dateStr);
  };

  useEffect(() => {
    renderCalendar();
  }, [currDate, availableDates, appointments]);

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
          {days.map((day, index) => {
            const dateStr = `${currDate.getFullYear()}-${String(
              currDate.getMonth() + 1
            ).padStart(2, "0")}-${String(day.date).padStart(2, "0")}`;
            const dayAppointments = getAppointmentsForDate(dateStr);

            return (
              <li
                key={index}
                className={`${
                  day.currentMonth
                    ? day.available
                      ? "available"
                      : day.fullyBooked
                      ? "fully-booked"
                      : "inactive"
                    : "inactive"
                }`}
                onClick={() => {
                  if (day.currentMonth && day.available) {
                    handleDateClick(dateStr);
                  }
                }}
                style={{
                  backgroundColor: day.available ? "#fbfbfb" : "#eaeaea",
                  color:
                    day.currentMonth && !day.available ? "#aaa" : "inherit",
                }}
              >
                {day.date}
                {dayAppointments.length > 0 && (
                  <div className="appointments-tooltip">
                    {dayAppointments.map((appointment, idx) => (
                      <div
                        key={idx}
                        className="appointment-item"
                        title={`Client: ${appointment.name} - ${appointment.time}`}
                      >
                        <span>{appointment.time}</span> - {appointment.name}
                      </div>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default AvailableCalendar;
