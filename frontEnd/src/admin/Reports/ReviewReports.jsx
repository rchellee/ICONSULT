import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import "./ReportsTab.css";

const ReviewReports = () => {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedReport, setSelectedReport] = useState("");

  useEffect(() => {
    fetchClients();
    fetchProjects();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:8081/clients");
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:8081/projects");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Review Reports", 10, 10);
    html2canvas(document.getElementById("review-chart")).then((canvas) => {
      doc.addImage(canvas.toDataURL("image/png"), "PNG", 10, 20, 180, 100);
      doc.save("review-report.pdf");
    });
  };

  // Mock Data for Average Client Rating (Example for a long list)
  const averageClientRatings = [
    { name: "Project A", rating: 4.2 },
    { name: "Project B", rating: 3.8 },
    { name: "Project C", rating: 4.5 },
    { name: "Project D", rating: 3.9 },
    { name: "Project E", rating: 4.7 },
    { name: "Project F", rating: 3.5 },
    { name: "Project G", rating: 4.6 },
    { name: "Project H", rating: 3.2 },
    { name: "Project I", rating: 4.9 },
    { name: "Project J", rating: 4.1 },
    { name: "Project K", rating: 3.8 },
    { name: "Project L", rating: 4.0 },
  ];

  // Mock Data for Number of Reviews per Project (Example for a long list)
  const reviewsPerProject = [
    { name: "Project A", reviews: 120 },
    { name: "Project B", reviews: 95 },
    { name: "Project C", reviews: 150 },
    { name: "Project D", reviews: 80 },
    { name: "Project E", reviews: 110 },
    { name: "Project F", reviews: 140 },
    { name: "Project G", reviews: 125 },
    { name: "Project H", reviews: 85 },
    { name: "Project I", reviews: 130 },
    { name: "Project J", reviews: 90 },
    { name: "Project K", reviews: 100 },
    { name: "Project L", reviews: 105 },
  ];

  return (
    <div className="review-p-4">
      {/* Select Report Type */}
      <div className="review-filter-buttons">
        <select
          className="bg-gray-200 text-black px-4 py-2 rounded"
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
        >
          <option value="">Select Report Type</option>
          <option value="Average Client Rating">Average Client Rating</option>
          <option value="Number of Reviews per Project">
            Number of Reviews per Project
          </option>
        </select>

        {selectedReport && (
          <div className="export-buttons">
            <CSVLink
              data={
                selectedReport === "Average Client Rating"
                  ? averageClientRatings
                  : reviewsPerProject
              }
              filename={`${selectedReport
                .replace(/\s+/g, "_")
                .toLowerCase()}.csv`}
              className="csv-button"
            >
              Export CSV
            </CSVLink>

            <button onClick={exportPDF} className="pdf-button">
              Export PDF
            </button>
          </div>
        )}
      </div>

      {/* Reports Grid */}
      <div className="review-grid">
        {/* Average Client Rating (Scrollable) */}
        <div className="chart-container">
          <h3>Average Client Rating</h3>
          <div className="scrollable-chart">
            <BarChart width={1000} height={300} data={averageClientRatings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="rating" fill="#8884d8" />
            </BarChart>
          </div>
        </div>

        {/* Number of Reviews per Project (Scrollable) */}
        <div className="chart-container">
          <h3>Number of Reviews per Project</h3>
          <div className="scrollable-chart">
            <BarChart width={1000} height={300} data={reviewsPerProject}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="reviews" fill="#82ca9d" />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewReports;
