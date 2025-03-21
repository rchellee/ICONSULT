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
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedProject, setSelectedProject] = useState("All");
  const [statusYear, setStatusYear] = useState(new Date().getFullYear());
  const [statusMonth, setStatusMonth] = useState("All");
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

  const uniqueYears = [
    "All",
    ...new Set(tasks.map((task) => new Date(task.due_date).getFullYear())),
  ].sort();

  const months = [
    "All",
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

  const filteredTasks = tasks.filter((task) => {
    const taskDate = new Date(task.due_date);
    const matchesYear =
      selectedYear === "All" || taskDate.getFullYear() === selectedYear;
    const matchesMonth =
      selectedMonth === "All" ||
      months[taskDate.getMonth() + 1] === selectedMonth;
    const matchesStatus =
      selectedStatus === "All" || task.status === selectedStatus;
    const matchesProject =
      selectedProject === "All" || task.project_id === Number(selectedProject);
    return matchesYear && matchesMonth && matchesStatus && matchesProject;
  });

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

  const taskPaymentData = filteredTasks.map((task) => ({
    name: task.task_name,
    amount: task.amount,
  }));

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
    return selectedStatus === "All" || task.status === selectedStatus;
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

  const unpaidTasks = tasks.filter((task) => task.paymentStatus === "Not Paid");
  const unpaidTaskData = unpaidTasks.map((task) => ({
    name: task.task_name,
    amount: task.amount,
    due_date: new Date(task.due_date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
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

        <select
          className="mb-4 p-2 border rounded"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
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

      <div className="tasks-graph-container">
        <div className="mb-4">
          <label className="mr-2">Filter by Status:</label>
          <select
            className="p-2 border rounded"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Completed">Paid (Completed)</option>
            <option value="Ongoing">Not Paid (Ongoing)</option>
          </select>
          <label className="mr-2">Filter by Project:</label>
          <select
            className="p-2 border rounded"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="All">All Projects</option>
            {Object.entries(projects).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <h3 className="text-lg font-semibold">Task Payment Status</h3>
        <BarChart width={1100} height={400} data={taskPaymentData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`Amount: $${value}`]} />
          <Legend />
          <Bar dataKey="amount" fill="#FF0000" name="Amount" />
        </BarChart>
      </div>
    </div>
  );
};

export default TaskReports;
