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
import landscapeTemplate from "../../assets/reports_landscape.jpg";
import AppointmentTemplate from "../../assets/reports_portrait.jpg";

const EmployeeReports = () => {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedReport, setSelectedReport] = useState("");
  const [taskStatusFilter, setTaskStatusFilter] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [tasksForSelectedEmployee, setTasksForSelectedEmployee] = useState([]);
  const [allTasksForCSV, setAllTasksForCSV] = useState([]);
  const [exportOption, setExportOption] = useState("all");
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
  const fetchAllTasksForCSV = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/allEmployeeTasks"
      );
      setAllTasksForCSV(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching all tasks for CSV", error);
      setAllTasksForCSV([]);
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
    fetchAllTasksForCSV();
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

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
  const exportPDF = async (data) => {
    if (data.length === 0) return alert("No data available to export.");

    const formatDate = (dateString) => {
      if (!dateString) return "";
      try {
        return new Date(dateString).toISOString().split("T")[0];
      } catch (e) {
        return dateString;
      }
    };
    const isLandscape = ["Total Employees"].includes(selectedReport);
    const doc = new jsPDF(isLandscape ? "landscape" : "portrait", "mm", "a4");
    const setupPage = (pdfDoc) => {
      const template = isLandscape ? landscapeTemplate : AppointmentTemplate;
      pdfDoc.addImage(
        template,
        "JPEG",
        0,
        0,
        pdfDoc.internal.pageSize.getWidth(),
        pdfDoc.internal.pageSize.getHeight()
      );
      pdfDoc.setFont("helvetica", "normal").setFontSize(8);
      return { textX: 14 };
    };

    const addFooter = (pdfDoc) => {
      const currentDate = new Date().toLocaleString();
      const yPos = pdfDoc.internal.pageSize.height - 3;
      pdfDoc.setFontSize(8).setTextColor(100);
      pdfDoc.text(
        `Generated by: ${localStorage.getItem("username") || "System"}`,
        14,
        yPos
      );
      pdfDoc.text(
        `Date Generated: ${currentDate}`,
        pdfDoc.internal.pageSize.width - 60,
        yPos,
        { align: "right" }
      );
    };

    setupPage(doc);
    let startY = 40;

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
      doc
        .setFontSize(20)
        .setFont("helvetica", "bold")
        .setTextColor(40)
        .text("Employee Overview", 145, startY + 3, { align: "center" });

      autoTable(doc, {
        startY: startY + 13,
        head: headers,
        body: employees.map((e) => [
          e.id,
          e.firstName,
          e.lastName,
          e.address,
          e.mobile_number,
          e.email_add,
          e.status,
          formatDate(e.birthday),
          e.age,
          e.gender,
          e.role,
          formatDate(e.modified_date),
        ]),
        styles: { fontSize: 8, textColor: [0, 0, 0] },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        showHead: "everyPage",
      });
    }
    if (selectedReport === "Tasks Assigned to Each Employee") {
      try {
        // Capture the chart element
        const chartElement = document.querySelector(
          ".employee-graphs .recharts-wrapper"
        );
        if (chartElement) {
          const canvas = await html2canvas(chartElement, {
            scale: 3,
            logging: true,
            useCORS: true,
          });
          const imgData = canvas.toDataURL("image/png");
          const imgWidth = 200;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Add chart to first page
          doc
            .setFontSize(16)
            .setFont("helvetica", "bold")
            .setTextColor(40)
            .text("Tasks Assigned to Each Employee", 105, 45, {
              align: "center",
            });

          doc.addImage(
            imgData,
            "PNG",
            (doc.internal.pageSize.getWidth() - imgWidth) / 2,
            50,
            imgWidth,
            imgHeight
          );

          // Add description below chart
          doc
            .setFontSize(10)
            .setTextColor(80)
            .text(
              "This bar chart represents the number of tasks assigned to each employee based on current filters.",
              105,
              50 + imgHeight + 10,
              { align: "center" }
            );
        }
      } catch (error) {
        console.error("Error capturing chart:", error);
      }

      // Add new page for task details
      doc.addPage();
      setupPage(doc);

      let grandTotal = 0;
      const tasksToExport =
        selectedEmployee === "All"
          ? allTasksForCSV
          : allTasksForCSV.filter(
              (task) => task.employeeId == selectedEmployee
            );

      const tasksByEmployee = tasksToExport.reduce((acc, task) => {
        const key = task.employeeId;
        if (!acc[key]) {
          acc[key] = {
            name: `${task.firstName} ${task.lastName}`,
            tasks: [],
          };
        }
        if (task.task_name) {
          acc[key].tasks.push(task);
        }
        return acc;
      }, {});

      // Reset Y position for new page
      let startY = 45;
      Object.values(tasksByEmployee).forEach((employee) => {
        doc
          .setFontSize(12)
          .setFont("helvetica", "bolditalic")
          .setTextColor(40)
          .text(employee.name, 10, startY);
        startY += 10;
        autoTable(doc, {
          startY: startY,
          head: [["Task Name", "Fee", "Total Amount", "Status", "Due Date"]],
          body: employee.tasks.map((task) => [
            task.task_name || "N/A",
            task.task_fee,
            task.amount,
            task.status || "N/A",
            task.due_date || "N/A",
          ]),
          styles: {
            fontSize: 8,
            cellPadding: 3,
            overflow: "linebreak",
          },
          headStyles: {
            fillColor: [220, 220, 220],
            textColor: [0, 0, 0],
            fontStyle: "bold",
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },
        });
        startY = doc.lastAutoTable.finalY + 10;
      });
    }
    for (let i = 1; i <= doc.internal.getNumberOfPages(); i++) {
      doc.setPage(i);
      addFooter(doc);
    }

    doc.save(`${selectedReport.replace(/\s+/g, "_").toLowerCase()}.pdf`);
  };
  const formatTasksAssignedtoEachEmployeeCSV = () => {
    let csvData = [["Employee", "Task", "Fee", "Total", "Status", "Due Date"]];

    // Ensure filtering applies correctly
    let tasksToExport =
      selectedEmployee && selectedEmployee !== "All"
        ? allTasksForCSV.filter((task) => task.employeeId == selectedEmployee)
        : allTasksForCSV;

    // Group tasks by employee
    const tasksByEmployee = tasksToExport.reduce((acc, task) => {
      if (!task.task_name) return acc; // Skip tasks with no name

      const key = task.employeeId;
      if (!acc[key]) {
        acc[key] = {
          name: `${task.firstName} ${task.lastName}`,
          tasks: [],
        };
      }
      acc[key].tasks.push(task);
      return acc;
    }, {});

    // Generate CSV data
    Object.values(tasksByEmployee).forEach((employee) => {
      csvData.push([employee.name, "", "", ""]); // Employee row

      employee.tasks.forEach((task) => {
        csvData.push([
          "", // Empty for indentation
          task.task_name || "N/A",
          task.task_fee || "N/A",
          task.amount || "N/A",
          task.status || "N/A",
          task.due_date ? formatDate(task.due_date) : "N/A",
        ]);
      });

      csvData.push(["", "", "", ""]); // Empty row for spacing
    });

    return csvData;
  };

  let exportCSVData = [];

  if (selectedReport === "Tasks Assigned to Each Employee") {
    exportCSVData = formatTasksAssignedtoEachEmployeeCSV();
  } else {
    exportCSVData = employees;
  }

  return (
    <div className="employee-p-4">
      <div className="filter-container">
        <select
          className="border p-2"
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
        >
          <option value="">Select Report Type</option>
          <option value="Total Employees">Total Employees</option>
          <option value="Tasks Assigned to Each Employee">
            Tasks Assigned to Each Employee
          </option>
        </select>
      </div>

      {selectedReport === "Tasks Assigned to Each Employee" && (
        <div className="mb-4">
          <select
            className="border p-2"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="All">All</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedReport && (
        <div className="flex gap-4">
          <CSVLink
            data={exportCSVData}
            filename={`${selectedReport.replace(/\s+/g, "_").toLowerCase()}_${
              exportOption === "all" ? "all" : selectedEmployee
            }.csv`}
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
      )}

      <div className="employee-summary-card">
        Total Employees
        <p>{employees.length}</p>
      </div>
      <div className="employee-graph-container">
        <div className="employee-graphs">
          <h3>Tasks Assigned to Each Employee</h3>
          <p className="graph-description">
            Shows the number of tasks assigned to employees.
          </p>
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
        <div className="employee-graphs">
          <h3>Tasks for selected Employee</h3>
          <p className="graph-description">
            Displays tasks for the selected employee.
          </p>{" "}
          <div className="space-x-4 mb-4">
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
