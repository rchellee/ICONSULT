import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AvailableCalendar from "./AvailableCalendar";
import "./calendar.css";
import Sidebar from "../sidebar";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";

const Availability = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [existingDates, setExistingDates] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const times = [
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
  ];

  useEffect(() => {
    // Fetch existing availability data from the backend
    fetch("http://localhost:8081/availability")
      .then((response) => response.json())
      .then((data) => {
        const fetchedDates = data.reduce(
          (acc, { dates, start_time, end_time }) => {
            acc[dates] = { start_time, end_time }; // Store both start and end times
            return acc;
          },
          {}
        );
        console.log(fetchedDates);
        setExistingDates(fetchedDates);
        setLoading(false); // Once data is fetched, stop loading
      })
      .catch((error) => {
        console.error("Error fetching existing availability:", error);
        setLoading(false);
      });
  }, []);

  const handleDateSelect = (dateStr) => {
    if (existingDates[dateStr]) {
      return; // Don't allow selecting dates already saved
    }
    setSelectedDates((prevSelectedDates) => {
      // Check if the date is already selected
      if (prevSelectedDates.some((item) => item.date === dateStr)) {
        // Remove the selected date
        return prevSelectedDates.filter((item) => item.date !== dateStr);
      } else {
        // Add the new date with default time values
        return [
          ...prevSelectedDates,
          { date: dateStr, startTime: "", endTime: "" },
        ];
      }
    });
  };

  const handleClearSelection = () => {
    setSelectedDates([]);
  };

  // Handle time change for a selected date
  const handleTimeChange = (index, type, value) => {
    const updatedDates = [...selectedDates];
    updatedDates[index][type] = value;
    setSelectedDates(updatedDates);
  };

  const isTimeInvalid = (startTime, endTime) => {
    const timeIndex = (time) => times.indexOf(time);
    return startTime && endTime && timeIndex(endTime) <= timeIndex(startTime);
  };

  const handleEdit = (date, startTime, endTime) => {
    setSelectedDates([
      {
        date: date,
        startTime: startTime,
        endTime: endTime,
      },
    ]);
  };

  const handleDelete = (date) => {
    if (
      window.confirm(
        `Are you sure you want to delete availability for ${date}?`
      )
    ) {
      // Delete from backend
      fetch(`http://localhost:8081/availability/${date}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            console.log(`Date ${date} deleted successfully`);

            // Update local state
            setExistingDates((prevDates) => {
              const updatedDates = { ...prevDates };
              delete updatedDates[date];
              return updatedDates;
            });
          } else {
            console.error("Error deleting date");
          }
        })
        .catch((error) => console.error("Error deleting date:", error));
    }
  };

  const handleSubmit = () => {
    const validSelections = selectedDates.filter(
      (date) =>
        date.startTime &&
        date.endTime &&
        !isTimeInvalid(date.startTime, date.endTime)
    );

    // Prepare data for submission
    const dataToSend = validSelections.map((date) => ({
      start_time: date.startTime,
      end_time: date.endTime,
      dates: date.date,
    }));

    // Use the POST endpoint
    fetch("http://localhost:8081/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data saved/updated successfully:", data);

        // Update local state to reflect changes
        setExistingDates((prevDates) => {
          const updatedDates = { ...prevDates };
          validSelections.forEach(({ date, startTime, endTime }) => {
            updatedDates[date] = { start_time: startTime, end_time: endTime };
          });
          return updatedDates;
        });

        setSelectedDates([]); // Clear selections
      })
      .catch((error) => {
        console.error("Error saving/updating data:", error);
      });
  };

  // Return loading state or render the availability component
  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <div className="admin-appointment-form-container">
      <Sidebar />
      <div className="content">
        <h1>Set Your Availability</h1>
        <div style={{ display: "flex", gap: "20px" }}>
          {/* Calendar Component */}
          <AvailableCalendar
            availableDates={{ ...existingDates }}
            onDateSelect={handleDateSelect}
          />
          {/* Display Selected Dates */}
          <Box
            sx={{
              width: 800,
              padding: 2,
              border: "1px solid #ccc",
              borderRadius: 4,
              backgroundColor: "#f9f9f9",
            }}
          >
            <strong>
              <h2>Selected Dates & Time</h2>
            </strong>

            {selectedDates.length > 0 ? (
              <List>
                {selectedDates.map((date, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 2,
                    }}
                  >
                    <ListItemText
                      primary={`${date.date}  ${date.startTime} - ${date.endTime}`}
                      sx={{ flex: 1 }}
                    />
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Start</InputLabel>
                        <Select
                          value={date.startTime}
                          onChange={(e) =>
                            handleTimeChange(index, "startTime", e.target.value)
                          }
                        >
                          {times.map((time, idx) => (
                            <MenuItem key={idx} value={time}>
                              {time}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>End</InputLabel>
                        <Select
                          value={date.endTime}
                          onChange={(e) =>
                            handleTimeChange(index, "endTime", e.target.value)
                          }
                        >
                          {times.map((time, idx) => (
                            <MenuItem key={idx} value={time}>
                              {time}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    {isTimeInvalid(date.startTime, date.endTime) && (
                      <Typography
                        variant="body6"
                        sx={{ color: "red", marginTop: 1 }}
                      >
                        *Time is invalid
                      </Typography>
                    )}
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="h7">No dates selected.</Typography>
            )}
            <strong>
              <h2>Availability:</h2>
            </strong>
            <List>
              {Object.entries(existingDates)
                .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB)) // Sort by date
                .map(([date, { start_time, end_time }]) => (
                  <ListItem
                    key={date}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 2,
                    }}
                  >
                    <ListItemText
                      primary={`${date}: ${start_time} - ${end_time}`}
                      sx={{ flex: 1 }}
                    />
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEdit(date, start_time, end_time)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(date)}
                      >
                        Del
                      </Button>
                    </Box>
                  </ListItem>
                ))}
            </List>

            <Button
              variant="contained"
              color="secondary"
              onClick={handleClearSelection}
              disabled={selectedDates.length === 0}
              style={{ marginTop: "10px" }}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={selectedDates.length === 0}
              style={{ marginTop: "10px" }}
            >
              Save
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Availability;
