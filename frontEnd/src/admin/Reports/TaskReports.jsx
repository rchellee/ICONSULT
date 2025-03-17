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

  const overdueTaskData = months.map((month) => ({
    month,
    count: overdueTasksByMonth[month],
  }));

  const taskDueData = tasks.map((task) => ({
    task_name: task.task_name,
    due_date: new Date(task.due_date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  const taskStatusCounts = ["Pending", "Ongoing", "Completed"].map(
    (status) => ({
      name: status,
      value: tasks.filter((task) => task.status === status).length,
    })
  );

  const paymentStatusCounts = ["Paid", "Not Paid"].map((status) => ({
    name: status,
    value: tasks.filter((task) =>
      status === "Paid"
        ? task.amount >= task.task_fee
        : task.amount < task.task_fee
    ).length,
  }));

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

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Task Reports", 14, 10);

    const tableColumn = [
      "Task Name",
      "Project",
      "Due Date",
      "Status",
      "Amount Paid",
      "Fee",
    ];
    const tableRows = [];

    tasks.forEach((task) => {
      const projectName =
        projects[task.project_id] || `Project ${task.project_id}`;
      const taskData = [
        task.task_name,
        projectName,
        new Date(task.due_date).toLocaleDateString(),
        task.status,
        task.amount,
        task.task_fee,
      ];
      tableRows.push(taskData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("task-report.pdf");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Task Reports</h2>
      <div className="mt-4 flex space-x-4">
        <CSVLink
          data={tasks}
          filename="task-report.csv"
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
      <div className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold">Task Status</h3>

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
      <div className="bg-white p-4 shadow rounded-lg mt-4">
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
        <BarChart width={1600} height={400} data={projectTaskData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#82ca9d" name="Task Count" />
        </BarChart>
      </div>
      <div className="bg-white p-4 shadow rounded-lg mt-4">
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
