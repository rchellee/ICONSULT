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
} from "recharts";

const EmployeeReports = () => {
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    department: "",
    jobTitle: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, [filters]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8081/taskReports", {
        params: filters,
      });
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Employee Report", 20, 10);
    html2canvas(document.getElementById("report-section"), { scale: 2 }).then(
      (canvas) => {
        const imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 10, 20, 180, 0);
        doc.save("employee-report.pdf");
      }
    );
  };

  const totalEmployees = employees.length;
  const newHires = employees.filter(
    (e) => new Date(e.hireDate).getMonth() === new Date().getMonth()
  ).length;

  const employeesByDepartment = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});

  const employeesByJobTitle = employees.reduce((acc, emp) => {
    acc[emp.jobTitle] = (acc[emp.jobTitle] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Employee Reports</h2>
      <div className="flex space-x-4 mb-4">
        <input
          type="date"
          className="border p-2"
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
        />
        <input
          type="date"
          className="border p-2"
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        />

      </div>

      <div id="report-section" className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold">Total Employees: {totalEmployees}</h3>
        <PieChart width={400} height={400}>
          <Pie
            data={Object.entries(employeesByDepartment).map(([name, value]) => ({ name, value }))}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
          >
            {Object.keys(employeesByDepartment).map((_, index) => (
              <Cell key={`cell-${index}`} fill={["#8884d8", "#82ca9d"][index % 2]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      <div className="mt-4 flex space-x-4">
        <CSVLink
          data={employees}
          filename="employee-report.csv"
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

export default EmployeeReports;
