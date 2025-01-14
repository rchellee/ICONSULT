import React, { useState, useRef } from "react";
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
import Topbar from "../Topbar";
import Sidebar from "../sidebar";

import "./ReportsTab.css";
import NewManagement from "./NewManagement/NewManagement";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReportsTab = () => {
  const [dateRange, setDateRange] = useState("This Month");
  const [isMonthlySubMenuOpen, setIsMonthlySubMenuOpen] = useState(false);
  const [isYearlySubMenuOpen, setIsYearlySubMenuOpen] = useState(false);
  const [isManagementDropdownOpen, setIsManagementDropdownOpen] = useState(false);
  const [isTimePeriodOpen, setIsTimePeriodOpen] = useState(false);
  const [selectedManagementOption, setSelectedManagementOption] = useState("");

  // Example data for Project Count Graph
  const projectData = {
    monthly: [4, 6, 5, 7, 8, 10, 6, 10, 11, 8, 6, 9],
    yearly: [50, 60, 70, 80, 90],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Projects (${dateRange})`,
      },
    },
  };

  const handleMonthlyOptionClick = (month) => {
    setDateRange(month);
    setIsMonthlySubMenuOpen(false);
  };

  const handleYearlyOptionClick = (year) => {
    setDateRange(year);
    setIsYearlySubMenuOpen(false);
  };

  const handleDropdownClick = () => {
    setIsMonthlySubMenuOpen(!isMonthlySubMenuOpen);
    setIsYearlySubMenuOpen(false);
  };

  const handleYearlyDropdownClick = () => {
    setIsYearlySubMenuOpen(!isYearlySubMenuOpen);
    setIsMonthlySubMenuOpen(false);
  };

  const handleManagementDropdownClick = () => {
    setIsManagementDropdownOpen(!isManagementDropdownOpen);
  };

  const handleTimePeriodClick = () => {
    setIsTimePeriodOpen(!isTimePeriodOpen);
  };

  const handleManagementOptionClick = (option) => {
    setSelectedManagementOption(option);
    setIsManagementDropdownOpen(false);
  };

  return (
    <div>
      <Topbar />
      <Sidebar />
      <div className="reports-tab-container">
        <div className="reports-header"></div>
        <div className="management-chart-section">
          <div className="chart-container">
            <div className="dropdown-container">
              <button
                className="Management-button"
                onClick={handleManagementDropdownClick}
              >
                Management
              </button>
              <button className="Time-button" onClick={handleTimePeriodClick}>
                Time Period
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
                  onClick={() => handleManagementOptionClick("Projects")}
                >
                  Projects
                </button>
                <button
                  className="dropdown-option"
                  onClick={() => handleManagementOptionClick("Task")}
                >
                  Task
                </button>
              </div>
            )}

            {isTimePeriodOpen && (
              <div className="time-period-buttons">
                <button className="time-option" onClick={handleDropdownClick}>
                  Monthly
                </button>
                <button
                  className="time-option"
                  onClick={handleYearlyDropdownClick}
                >
                  Yearly
                </button>
              </div>
            )}

            {isMonthlySubMenuOpen && (
              <div className="monthly-options">
                {[
                  "Per Month",
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
                ].map((month) => (
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

            {isYearlySubMenuOpen && (
              <div className="yearly-options">
                {["2020", "2021", "2022", "2023", "2024"].map((year) => (
                  <button
                    key={year}
                    className="time-select-option"
                    onClick={() => handleYearlyOptionClick(year)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}

            {selectedManagementOption === "Client" ? (
              <NewManagement />
            ) : (
              <Bar
                options={barChartOptions}
                data={{
                  labels:
                    dateRange === "Per Month"
                      ? [
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
                        ]
                      : ["2020", "2021", "2022", "2023", "2024"],
                  datasets: [
                    {
                      label:
                        dateRange === "Per Month"
                          ? "Projects per Month"
                          : "Projects per Year",
                      data:
                        dateRange === "Per Month"
                          ? projectData.monthly
                          : projectData.yearly,
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

export default ReportsTab;
