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
import Topbar from "../Topbar";
import Sidebar from "../sidebar";
import "./ReportsTab.css";

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
  const [reportType, setReportType] = useState("Overview");

  // Example data for the Overview Section
  const overviewMetrics = [
    {
      title: "Total Revenue",
      value: "$120,000",
      chartData: [20000, 30000, 50000, 20000],
    },
    {
      title: "Total Hours Worked",
      value: "1200 hrs",
      chartData: [300, 400, 250, 250],
    },
    { title: "Projects Completed", value: "15", chartData: [3, 4, 5, 3] },
    { title: "Client Satisfaction", value: "95%", chartData: [90, 92, 95, 95] },
  ];

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Performance Metrics",
      },
    },
  };

  const projectPerformanceData = [
    {
      name: "Project A",
      status: "Completed",
      progress: 100,
      budget: "$45k",
      hours: 120,
    },
    {
      name: "Project B",
      status: "Ongoing",
      progress: 60,
      budget: "$30k",
      hours: 80,
    },
    {
      name: "Project C",
      status: "Delayed",
      progress: 40,
      budget: "$20k",
      hours: 50,
    },
  ];

  return (
    <div>
      <Topbar />
      <Sidebar />
      <div className="reports-tab-container">
        <div className="reports-header">
          <h2>Reports</h2>
          <div className="reports-filters">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="Last 3 Months">Last 3 Months</option>
              <option value="Custom Range">Custom Range</option>
            </select>

            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="Overview">Overview</option>
              <option value="Project Performance">Project Performance</option>
              <option value="Financial">Financial</option>
              <option value="Time Tracking">Time Tracking</option>
              <option value="Client Reports">Client Reports</option>
            </select>

            <button>Export</button>
          </div>
        </div>

        {reportType === "Overview" && (
          <div className="overview-section">
            <h3>Overview</h3>
            <div className="overview-metrics">
              {overviewMetrics.map((metric, index) => (
                <div key={index} className="metric-card">
                  <h4>{metric.title}</h4>
                  <p>{metric.value}</p>
                  <Bar
                    options={barChartOptions}
                    data={{
                      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                      datasets: [
                        {
                          label: metric.title,
                          data: metric.chartData,
                          backgroundColor: "rgba(75, 192, 192, 0.5)",
                        },
                      ],
                    }}
                    width={300} // Width in pixels
                    height={100} // Height in pixels
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {reportType === "Project Performance" && (
          <div className="project-performance-section">
            <h3>Project Performance</h3>
            <table>
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Budget</th>
                  <th>Total Hours</th>
                </tr>
              </thead>
              <tbody>
                {projectPerformanceData.map((project, index) => (
                  <tr key={index}>
                    <td>{project.name}</td>
                    <td>{project.status}</td>
                    <td>
                      <div className="progress-bar">
                        <div
                          className="progress"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </td>
                    <td>{project.budget}</td>
                    <td>{project.hours} hrs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add additional sections for Financial, Time Tracking, Client Reports */}
      </div>
    </div>
  );
};

export default ReportsTab;
