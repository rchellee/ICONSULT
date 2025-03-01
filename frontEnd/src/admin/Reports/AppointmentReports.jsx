import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
// import "jspdf-autotable";

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

const AppointmentReports = () => {
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    clientId: "",
    consultationType: "",
    platform: "",
  });

  useEffect(() => {
    fetchClients();
    fetchAppointments();
  }, [filters]);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:8081/clients");
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/appointmentReports",
        {
          params: {
            startDate: filters.startDate,
            endDate: filters.endDate,
            clientId: filters.clientId, // Pass clientId
          },
        }
      );
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments", error);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    const elements = [
      { id: "summary-section", title: "Appointment Summary" },
      {
        id: "appointments-client",
        title: "Appointments per Client",
        description: "This chart shows the number of appointments per client.",
      },
      {
        id: "appointments-platform",
        title: "Appointments by Platform",
        description:
          "This chart shows how appointments are distributed across different platforms.",
      },
      {
        id: "appointments-consultation",
        title: "Appointments by Consultation Type",
        description:
          "This chart categorizes appointments based on the type of consultation.",
      },
    ];

    let currentPage = 1;

    const captureElement = (element, title, description, callback) => {
      const section = document.getElementById(element);
      if (!section) return;

      html2canvas(section, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        if (currentPage > 1) doc.addPage(); // Add a new page for each section
        doc.text(title, 10, 10);
        if (description) {
          doc.text(description, 10, 20);
        }
        doc.addImage(imgData, "PNG", 10, 30, 180, 0); // Fit to page
        currentPage++;

        callback();
      });
    };

    let index = 0;
    const processNext = () => {
      if (index < elements.length) {
        const { id, title, description } = elements[index];
        index++;
        captureElement(id, title, description, processNext);
      } else {
        doc.save("appointment-report.pdf");
      }
    };

    processNext();
  };

  const filteredAppointments = filters.clientId
    ? appointments.filter((a) => a.client_id == filters.clientId)
    : appointments;

  const totalAppointments = filteredAppointments.length;

  const currentMonthAppointments = filteredAppointments.filter(
    (a) => new Date(a.date).getMonth() === new Date().getMonth()
  ).length;

  const appointmentsByClient = clients.map((client) => ({
    name: `${client.firstName} ${client.lastName}`,
    value: filteredAppointments.filter((a) => a.client_id === client.id).length,
  }));

  const appointmentsByPlatform = [
    "In-Person",
    "Zoom",
    "Google Meet",
    "Phone Call",
    "Microsoft Teams",
  ].map((platform) => ({
    name: platform,
    value: filteredAppointments.filter((a) => a.platform === platform).length,
  }));

  const appointmentsByConsultationType = [
    "Strategic Planning Consultation",
    "Corporate Governance Review",
    "Business Process Improvement",
    "Risk Management Consultation",
    "Organizational Development Advisory",
    "Financial Advisory",
    "Accounting Consultation",
    "Legal Advisory",
    "Tax Advisory",
    "Payroll System Setup Consultation",
    "Employee Benefits and Compliance Advisory",
    "Startup Planning",
    "Business Structuring and Licensing Advisory",
    "Business Name Registration",
    "SEC/DTI/Mayor’s Permit Assistance",
    "Compliance Consultation",
    "Follow up",
    "Others",
  ].map((type) => ({
    name: type,
    value: filteredAppointments.filter((a) => a.consultationType === type)
      .length,
  }));

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Appointment Reports</h2>
      <div className="flex space-x-4 mb-4">
        <input
          type="date"
          className="border p-2"
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
        />
        <input
          type="date"
          className="border p-2"
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        />
        <select
          className="border p-2"
          value={filters.clientId}
          onChange={(e) => setFilters({ ...filters, clientId: e.target.value })}
        >
          <option value="">All Clients</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.firstName} {client.lastName}
            </option>
          ))}
        </select>
      </div>

      <div id="summary-section" className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold">
          Total Appointments: {totalAppointments}
        </h3>
        <h3 className="text-lg font-semibold">
          Appointments This Month: {currentMonthAppointments}
        </h3>
      </div>

      {!filters.clientId && (
        <div
          id="appointments-client"
          className="bg-white p-4 shadow rounded-lg"
        >
          <h3 className="text-lg font-semibold">Appointments per Client</h3>
          <PieChart width={1000} height={500}>
            <Pie
              data={appointmentsByClient}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={250}
            >
              {appointmentsByClient.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={["#8884d8", "#82ca9d"][index % 2]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      )}

      <div
        id="appointments-platform"
        className="bg-white p-4 shadow rounded-lg"
      >
        <h3 className="text-lg font-semibold">Appointments by Platform</h3>
        <BarChart width={1000} height={500} data={appointmentsByPlatform}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </div>

      <div
        id="appointments-consultation"
        className="bg-white p-4 shadow rounded-lg"
      >
        <h3 className="text-lg font-semibold">
          Appointments by Consultation Type
        </h3>
        <BarChart
          width={1500}
          height={500}
          data={appointmentsByConsultationType}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#82ca9d" />
        </BarChart>
      </div>

      <div className="mt-4 flex space-x-4">
        <CSVLink
          data={appointments}
          filename="appointment-report.csv"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Export CSV
        </CSVLink>
        <button
          onClick={exportPDF}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Export PDF
        </button>
      </div>
    </div>
  );
};

export default AppointmentReports;
