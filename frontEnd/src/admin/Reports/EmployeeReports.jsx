import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const EmployeeReports = () => {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedReport, setSelectedReport] = useState("");
  const [taskStatusFilter, setTaskStatusFilter] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [tasksForSelectedEmployee, setTasksForSelectedEmployee] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    year: "All",
    month: "All",
    
  });

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8081/employeeReports");
      setEmployees(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching employee reports", error);
      setEmployees([]);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8081/ETReports");
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching task reports", error);
      setTasks([]);
    }
  };

  const fetchTasksForEmployee = async (employeeId) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/tasksForEmployee/${employeeId}`
      );
      setTasksForSelectedEmployee(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Error fetching tasks for employee", error);
      setTasksForSelectedEmployee([]);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchTasks();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      setSelectedEmployee(employees[0].id);
    }
  }, [employees]);

  useEffect(() => {
    if (selectedEmployee) {
      fetchTasksForEmployee(selectedEmployee);
    }
  }, [selectedEmployee]);

  // Filter tasks for the "Tasks Assigned to Each Employee" chart
  const filteredTasks = tasks.filter((task) => {
    if (!task.created_at) return false;
    const taskDate = new Date(task.created_at);
    const taskYear = taskDate.getFullYear().toString();
    const taskMonth = taskDate.toLocaleString("default", { month: "long" });

    const statusMatch =
      taskStatusFilter === "All" ||
      (taskStatusFilter === "Completed" &&
        task.status?.toLowerCase() === "completed") ||
      (taskStatusFilter === "Ongoing" &&
        task.status?.toLowerCase() !== "completed");

    return (
      statusMatch &&
      (filters.year === "All" || taskYear === filters.year) &&
      (filters.month === "All" || taskMonth === filters.month)
    );
  });
  const colors = [
    "#3498db", // Blue
    "#2ecc71", // Green
    "#e74c3c", // Red
    "#f39c12", // Yellow-Orange
    "#9b59b6", // Purple
    "#1abc9c", // Teal
    "#e67e22", // Dark Orange
    "#95a5a6", // Gray
  ];

  const taskColors = [
    "#3498db", // Blue
    "#2ecc71", // Green
    "#e74c3c", // Red
    "#f39c12", // Yellow-Orange
    "#9b59b6", // Purple
    "#1abc9c", // Teal
    "#e67e22", // Dark Orange
    "#95a5a6", // Gray
    "#c0392b", // Dark Red
    "#8e44ad", // Deep Purple
  ];

  // Map tasks for the "Tasks Assigned to Each Employee" chart
  const taskData = filteredTasks.map((task, index) => ({
    name: `${task.firstName.charAt(0)}. ${task.lastName || "Unknown"}`,
    tasks: task.task_count || 0,
    color: taskColors[index % taskColors.length], // Assign color dynamically
  }));
  const exportPDF = async () => {
    const doc = new jsPDF("landscape", "mm", "a4");
    doc.setFontSize(8);
    doc.text(selectedReport, 10, 10);
    let yPos = 20;
    const chartElement = document.getElementById("chart-container");
    if (chartElement) {
      try {
        // Capture chart as an image
        const canvas = await html2canvas(chartElement);
        const imgData = canvas.toDataURL("image/png");

        // Add image to the PDF
        doc.addImage(imgData, "PNG", 10, yPos, 120, 80);
        yPos += 90; // Adjust position for the table
      } catch (error) {
        console.error("Error capturing chart:", error);
      }
    }
    if (selectedReport === "Total Employees") {
      const headers = [
        [
          "id",
          "First Name",
          "Last Name",
          "Address",
          "Mobile Number",
          "Email",
          "Status",
          "Birthday",
          "Age",
          "gender",
          "Role",
          "Date Updated",
        ],
      ];
      const data = employees.map((e) => [
        e.id,
        e.firstName,
        e.lastName,
        e.address,
        e.mobile_number,
        e.email_add,
        e.status,
        e.birthday,
        e.age,
        e.gender,
        e.role,
        e.date_paid,
        e.modified_date,
      ]);

      autoTable(doc, {
        startY: yPos,
        head: headers,
        body: data,
        styles: { fontSize: 8 },
      });
    }

    doc.save(`${selectedReport.replace(/\s+/g, "_").toLowerCase()}.pdf`);
  };
  const formatTasksAssignedtoEachEmployeeCSV = () => {
    let csvData = [];

    employees.forEach((employee) => {
      const employeesTasks = tasks.filter((e) => e.employee === employee.id);

      if (employeesTasks.length > 0) {
        csvData.push([
          `${employee.firstName} ${employee.lastName} - ${employeesTasks.length} task`,
        ]); // Add employee name and task count

        // Completed Tasks
        const completedTasks = employeesTasks.filter(
          (task) => task.status?.toLowerCase() === "completed"
        );
        if (completedTasks.length > 0) {
          csvData.push(["Completed"]);
          csvData.push(["Task name", "due_date", "amount"]);
          completedTasks.forEach((task) => {
            csvData.push([task.task_name, task.due_date, task.amount]);
          });
        }

        // Ongoing Tasks
        const ongoingTasks = employeesTasks.filter(
          (task) => task.status?.toLowerCase() !== "completed"
        );
        if (ongoingTasks.length > 0) {
          csvData.push(["Ongoing"]);
          csvData.push(["Task name", "due_date", "amount"]);
          ongoingTasks.forEach((task) => {
            csvData.push([task.task_name, task.due_date, task.amount]);
          });
        }

        csvData.push([]); 
      }
    });

    return csvData;
  };
  const formatTasksforSelectedEmployeeCSV = () => {
    let csvData = [];

    // Group tasks by employee
    const tasksByEmployee = tasksForSelectedEmployee.reduce((acc, task) => {
      const employeeName = `${task.firstName} ${task.lastName}`;
      if (!acc[employeeName]) {
        acc[employeeName] = [];
      }
      acc[employeeName].push(task);
      return acc;
    }, {});

    // Populate CSV data
    Object.entries(tasksByEmployee).forEach(([employeeName, tasks]) => {
      // Add employee name
      csvData.push([employeeName]);

      // Add task details for the employee
      tasks.forEach((task) => {
        csvData.push([
          "",
          task.task_name,
          task.due_date,
          task.amount,
          task.status,
        ]);
      });

      csvData.push([]); // Add a blank row for spacing
    });

    return csvData;
  };

  let exportCSVData = [];

  if (selectedReport === "Tasks Assigned to Each Employee") {
    exportCSVData = formatTasksAssignedtoEachEmployeeCSV();
  } else if (selectedReport === "Tasks for Selected Employee") {
    exportCSVData = formatTasksforSelectedEmployeeCSV();
  } else {
    exportCSVData = employees; // Default case for Total Appointments & Appointments This Month
  }

  return (
    <div className="employee-p-4">
      {/* Filters */}
      <div className="filter-container">
        <select
          className="filter-select"
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
        >
          <option value="">Select Report Type</option>
          <option value="Total Employees">Total Employees</option>
          <option value="Tasks Assigned to Each Employee">
            Tasks Assigned to Each Employee
          </option>
          <option value="Tasks for Selected Employee">
            Tasks for Selected Employee
          </option>
        </select>

        {selectedReport && (
          <>
            <CSVLink
              data={exportCSVData}
              filename={`${selectedReport
                .replace(/\s+/g, "_")
                .toLowerCase()}.csv`}
              className="text-white px-4 py-2 rounded"
            >
              Export CSV
            </CSVLink>
            <button
              onClick={exportPDF}
              className="text-white px-4 py-2 rounded"
            >
              Export PDF
            </button>
          </>
        )}
      </div>

      <div className="employee-summary-card">
          Total Employees
          <p>{employees.length}</p>
      </div>
       {/* Tasks Assigned to Each Employee */}
      <div className="employee-graph-container">
      <div className="employee-graphs">
          <h3>Tasks Assigned to Each Employee</h3>
          <p className="graph-description">Shows the number of tasks assigned to employees.</p>
          <select
            className="employee-filter-each"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          >
            <option value="All">Year</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
          <select
            className="border p-2"
            value={filters.month}
            onChange={(e) => setFilters({ ...filters, month: e.target.value })}
          >
            <option value="All">Month</option>
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
          <select
            className="border p-2 mb-4"
            value={taskStatusFilter}
            onChange={(e) => setTaskStatusFilter(e.target.value)}
          >
            <option value="All">Task</option>
            <option value="Completed">Completed</option>
            <option value="Ongoing">Ongoing</option>
          </select>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart layout="vertical" data={taskData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="tasks">
                {taskData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
        </ResponsiveContainer>
      </div>


     {/* Tasks Assigned to Each Employee */}
     <div className="employee-graphs">
      <h3>Tasks for selected Employee</h3>
      <p className="graph-description">Displays tasks for the selected employee.</p>        <div className="space-x-4 mb-4">
          <select
            className="employee-filter-each"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            {employees.map((emp) => (
              <option
                key={emp.id}
                value={emp.id}
              >{`${emp.firstName} ${emp.lastName}`}</option>
            ))}
          </select>
        
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            layout="vertical"
            data={tasksForSelectedEmployee}
            margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="task_name" type="category" width={150} />
            <Tooltip
              content={({ payload }) => {
                if (payload && payload.length) {
                  const task = payload[0].payload;
                  return (
                    <div className="bg-white p-2 border rounded shadow">
                      <p className="text-xs text-gray-600">
                        Status: {task.status}
                      </p>
                      <p className="text-xs text-gray-600">
                        Amount: {task.amount}
                      </p>
                      <p className="text-xs text-gray-600">
                        Task Due: {task.due_date}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="task_name" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount">
                {tasksForSelectedEmployee.map((_, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
        </ResponsiveContainer>
      </div>
      </div>
      </div>
      </div>

  );
};

export default EmployeeReports;
