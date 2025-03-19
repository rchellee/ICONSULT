import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";

const TaskReports = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState({});
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const uniqueYears = [
    ...new Set(tasks.map((task) => new Date(task.due_date).getFullYear())),
  ].sort();
  const [statusYear, setStatusYear] = useState(new Date().getFullYear());
  const [statusMonth, setStatusMonth] = useState("All");
  const months = [
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
  ];
  const [selectedReport, setSelectedReport] = useState("");

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8081/taskReports");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:8081/project");
      const projectData = response.data.reduce((acc, project) => {
        acc[project.id] = project.projectName;
        return acc;
      }, {});
      setProjects(projectData);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  const filteredTaskStatusCounts = ["Pending", "Ongoing", "Completed"].map(
    (status) => ({
      name: status,
      value: tasks.filter((task) => {
        const taskDate = new Date(task.due_date);
        const matchesYear = taskDate.getFullYear() === statusYear;
        const matchesMonth =
          statusMonth === "All" || months[taskDate.getMonth()] === statusMonth;
        return matchesYear && matchesMonth && task.status === status;
      }).length,
    })
  );

  const filteredTaskDueData = tasks
    .filter(
      (task) =>
        new Date(task.due_date).getFullYear() === selectedYear &&
        task.status !== "Completed"
    )
    .map((task) => ({
      task_name: task.task_name,
      due_date: new Date(task.due_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));

  const today = new Date();
  const overdueTasks = tasks.filter(
    (task) => new Date(task.due_date) < today && task.status !== "Completed"
  );

  const overdueTasksByMonth = months.reduce((acc, month) => {
    acc[month] = 0;
    return acc;
  }, {});

  overdueTasks.forEach((task) => {
    const monthIndex = new Date(task.due_date).getMonth();
    const monthName = months[monthIndex];
    overdueTasksByMonth[monthName] += 1;
  });

  const filteredTasksForProjects = tasks.filter((task) => {
    const taskDate = new Date(task.due_date);
    const matchesYear = taskDate.getFullYear() === statusYear;
    const matchesMonth =
      statusMonth === "All" || months[taskDate.getMonth()] === statusMonth;
    return matchesYear && matchesMonth;
  });

  const tasksPerProject = filteredTasksForProjects.reduce((acc, task) => {
    const projectName =
      projects[task.project_id] || `Project ${task.project_id}`;
    acc[projectName] = (acc[projectName] || 0) + 1;
    return acc;
  }, {});

  const projectTaskData = Object.keys(tasksPerProject).map((name) => ({
    name,
    value: tasksPerProject[name],
  }));

  const exportPDF = async () => {
    if (!selectedReport) return;
    const doc = new jsPDF("p", "mm", "a4");
    const section = document.getElementById(selectedReport);
    if (!section) return;

    try {
      const canvas = await html2canvas(section, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      doc.text(selectedReport, 10, 10);
      doc.addImage(imgData, "PNG", 10, 30, 180, 0);
      doc.save(`${selectedReport.replace(/\s+/g, "_").toLowerCase()}.pdf`);
    } catch (error) {
      console.error(`Error capturing ${selectedReport}:`, error);
    }
  };

  return (
    <div className="tasks-p-4">
      <div className="mt-4 flex space-x-4">
        <select
          className="bg-gray-200 text-black px-4 py-2 rounded"
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
        >
          <option value="">Select Report Type</option>
          <option value="Task Status">Task Status</option>
          <option value="Tasks Per Project">Tasks Per Project</option>
          <option value="Task Due">Task Due</option>
        </select>

        {selectedReport && (
          <>
            <CSVLink
              data={tasks}
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
      <div className="tasks-graph-container">
        <h3>Task Status</h3>

        {/* Year Filter */}
        <select
          className="mb-2 p-2 border rounded"
          value={statusYear}
          onChange={(e) => setStatusYear(Number(e.target.value))}
        >
          {uniqueYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Month Filter */}
        <select
          className="mb-4 p-2 border rounded ml-2"
          value={statusMonth}
          onChange={(e) => setStatusMonth(e.target.value)}
        >
          <option value="All">All Months</option>
          {months.map((month, index) => (
            <option key={index} value={month}>
              {month}
            </option>
          ))}
        </select>

        <PieChart width={400} height={400}>
          <Pie
            data={filteredTaskStatusCounts}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
          >
            {filteredTaskStatusCounts.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={["#8884d8", "#82ca9d", "#ff8042"][index % 3]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      <div className="tasks-graph-container">
        <h3 className="text-lg font-semibold">Tasks Per Project</h3>
        {/* Year Filter */}
        <select
          className="mb-2 p-2 border rounded"
          value={statusYear}
          onChange={(e) => setStatusYear(Number(e.target.value))}
        >
          {uniqueYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Month Filter */}
        <select
          className="mb-4 p-2 border rounded ml-2"
          value={statusMonth}
          onChange={(e) => setStatusMonth(e.target.value)}
        >
          <option value="All">All Months</option>
          {months.map((month, index) => (
            <option key={index} value={month}>
              {month}
            </option>
          ))}
        </select>
        <BarChart width={1100} height={400} data={projectTaskData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#82ca9d" name="Task Count" />
        </BarChart>
      </div>

      <div className="tasks-graph-container">
        <h3 className="text-lg font-semibold">Task Due</h3>
        <select
          className="mb-4 p-2 border rounded"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {uniqueYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <LineChart width={1000} height={300} data={filteredTaskDueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="task_name" />
          <YAxis dataKey="due_date" type="category" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="due_date"
            stroke="#FF0000"
            name="Due Date"
          />
        </LineChart>
      </div>
    </div>
  );
};

export default TaskReports;
