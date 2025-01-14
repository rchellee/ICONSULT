import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ClientReportsTab = () => {
  const [dateRange, setDateRange] = useState("This Month");
  const [isManagementDropdownOpen, setIsManagementDropdownOpen] = useState(false);
  const [isTimePeriodOpen, setIsTimePeriodOpen] = useState(false);
  const [isMonthlyHovered, setIsMonthlyHovered] = useState(false);  // Track hover state for Monthly
  const [selectedManagementOption, setSelectedManagementOption] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // Example data for Client Count Graph
  const clientData = {
    monthly: [4, 6, 5, 7, 8, 10, 6, 10, 11, 8, 6, 9],
    weekly: {
      January: [1, 2],
      February: [],
      March: [],
      April: [],
      May: [],
      June: [],
      July: [],
      August: [],
      September: [],
      October: [],
      November: [],
      December: [],
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Clients (${dateRange})`,
      },
    },
  };

  const handleMonthlyOptionClick = (month) => {
    setSelectedMonth(month === "Per Month" ? "" : month);
    setDateRange(month);
    setIsMonthlyHovered(false);  // Close submenu when a month is selected
    setIsTimePeriodOpen(false);  // Close the time period submenu after selection
  };

  const handleDropdownClick = () => {
    setIsTimePeriodOpen(!isTimePeriodOpen);
  };

  const handleManagementDropdownClick = () => {
    setIsManagementDropdownOpen(!isManagementDropdownOpen);
  };

  const handleManagementOptionClick = (option) => {
    setSelectedManagementOption(option);
    setIsManagementDropdownOpen(false);
  };

  // This function will handle hover event over "Monthly" button
  const handleMonthlyHover = () => {
    setIsMonthlyHovered(true);
  };

  const handleMonthlyLeave = () => {
    setIsMonthlyHovered(false);
  };

  return (
    <div>
      <div className="client-reports-tab-container">
        <div className="client-reports-header"></div>
        <div className="management-chart-section">
          <div className="chart-container">
            <div className="dropdown-container">
              <button
                className="Time-button"
                onClick={handleDropdownClick}
              >
                Time Period
              </button>
              <button
                className="YearlyBucket-button"
              >
                Yearly Bucket
              </button>
              <button
                className="Display-Chart-button"
              >
                Display Chart
              </button>
            </div>

            {isManagementDropdownOpen && (
              <div className="management-dropdown">
                <button
                  className="dropdown-option"
                  onClick={() => handleManagementOptionClick("Client")}
                >
                  Client
                </button>
                <button
                  className="dropdown-option"
                  onClick={() => handleManagementOptionClick("Clients")}
                >
                  Clients
                </button>
                <button
                  className="dropdown-option"
                  onClick={() => handleManagementOptionClick("Task")}
                >
                  Task
                </button>
                <button
                  className="dropdown-option"
                  onClick={() => handleManagementOptionClick("Employee")}
                >
                  Employee
                </button>
                <button
                  className="dropdown-option"
                  onClick={() => handleManagementOptionClick("Appointments")}
                >
                  Appointments
                </button>
                <button
                  className="dropdown-option"
                  onClick={() => handleManagementOptionClick("Revenue")}
                >
                  Revenue
                </button>
              </div>
            )}

            {isTimePeriodOpen && (
              <div className="time-period-buttons">
                <button
                  className="time-option"
                  onClick={() => handleMonthlyOptionClick("Per Month")}
                >
                  Per Month
                </button>
                <button
                  className="time-option"
                  onClick={() => handleMonthlyOptionClick("Monthly")}
                  onMouseEnter={handleMonthlyHover}
                  onMouseLeave={handleMonthlyLeave}
                >
                  Monthly
                </button>
              </div>
            )}

            {isMonthlyHovered && (
              <div
                className="monthly-options"
                onMouseEnter={handleMonthlyHover}
                onMouseLeave={handleMonthlyLeave}
              >
                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
                  <button
                    key={month}
                    className="time-select-option"
                    onClick={() => handleMonthlyOptionClick(month)}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}

            {selectedManagementOption === "Client" ? (
              <ClientReports />
            ) : selectedMonth && selectedMonth !== "Per Month" ? (
              <Bar
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: `Weekly Clients (${selectedMonth})` },
                  },
                }}
                data={{
                  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                  datasets: [
                    {
                      label: `Clients in ${selectedMonth}`,
                      data: clientData.weekly[selectedMonth],
                      backgroundColor: "rgba(99, 132, 255, 0.5)",
                    },
                  ],
                }}
                width={300}
                height={100}
              />
            ) : (
              <Bar
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    title: {
                      display: true,
                      text: "Per Month Clients of Year 2024",
                    },
                  },
                }}
                data={{
                  labels: [
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
                  ],
                  datasets: [
                    {
                      label: "Clients per Month",
                      data: clientData.monthly,
                      backgroundColor: "rgba(247, 131, 164, 0.5)",
                    },
                  ],
                }}
                width={300}
                height={100}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientReportsTab;
