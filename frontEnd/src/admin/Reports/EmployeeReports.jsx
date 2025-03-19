import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const EmployeeReports = () => {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedReport, setSelectedReport] = useState("");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    year: "All",
    month: "All",
  });

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8081/employeeReports");
      console.log("API Response:", response.data); // Debugging
      setEmployees(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching employee reports", error);
      setEmployees([]); // Ensure employees is always an array
    }
  };
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8081/ETReports");
      console.log("Task API Response:", response.data); // Debugging
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching task reports", error);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchTasks();
  }, []);

  const exportPDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const sections = {
      "Tasks Assigned to Each Employee": "tasks-assigned-section",
      "Tasks completed vs. pending per employee": "tasks-status-section",
      "Employee workload distribution": "workload-section",
    };

    const sectionId = sections[selectedReport];
    if (!sectionId) return;
    const section = document.getElementById(sectionId);

    try {
      const canvas = await html2canvas(section, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      doc.text(selectedReport, 10, 10);
      doc.addImage(imgData, "PNG", 10, 30, 180, 0);
      doc.save("employee-report.pdf");
    } catch (error) {
      console.error(`Error capturing ${sectionId}:`, error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (!task.created_at) return false; // Ensure created_at exists

    const taskDate = new Date(task.created_at);
    const taskYear = taskDate.getFullYear();
    const taskMonth = taskDate.toLocaleString("default", { month: "long" });

    return (
      (filters.year === "All" || taskYear.toString() === filters.year) &&
      (filters.month === "All" || taskMonth === filters.month)
    );
  });

  const totalEmployees = employees.length;
  const taskData = filteredTasks.map((task) => ({
    name: `${task.firstName.charAt(0)}. ${task.lastName || "Unknown"}`,
    tasks: task.task_count || 0,
  }));

  return (
    <div className="employee-p-4">
      {/* Filters */}
      <div className="flex space-x-4 mb-4">
        <select
          className="border p-2"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        >
          <option value="All">All Years</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>
        <select
          className="border p-2"
          value={filters.month}
          onChange={(e) => setFilters({ ...filters, month: e.target.value })}
        >
          <option value="All">All Months</option>
          {[
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
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex space-x-4">
        <select
          className="bg-gray-200 text-black px-4 py-2 rounded"
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
        >
          <option value="">Select Report Type</option>
          <option value="Tasks Assigned to Each Employee">
            Tasks Assigned to Each Employee
          </option>
          <option value="Tasks completed vs. pending per employee">
            Tasks completed vs. pending per employee
          </option>
          <option value="Employee workload distribution">
            Employee workload distribution
          </option>
        </select>

        {selectedReport && (
          <>
            <CSVLink
              data={employees}
              filename={`${selectedReport
                .replace(/\s+/g, "_")
                .toLowerCase()}.csv`}
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
          </>
        )}
      </div>

      <div className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold">
          Total Employees: {employees.length}
        </h3>
      </div>

      <div className="employee-graph-container">
        <h3 className="text-lg font-semibold mb-2">
          Tasks Assigned to Each Employee
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            layout="vertical"
            data={taskData}
            margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="tasks" fill="#8884d8" name="Number of Tasks" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmployeeReports;
