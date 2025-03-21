import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
  const [employees, setEmployees] = useState({});
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
    fetchEmployees();
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

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8081/employeeReports");
      const employeeData = response.data.reduce((acc, emp) => {
        acc[emp.id] = `${emp.firstName} ${emp.lastName}`;
        return acc;
      }, {});
      setEmployees(employeeData);
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };

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

  const formatTaskbyStatusCSV = () => {
    let csvData = [];

    const status = ["Ongoing", "Completed"];

    status.forEach((status) => {
      const statusTasks = tasks.filter((t) => t.status === status);

      if (statusTasks.length > 0) {
        csvData.push([status]);
        csvData.push([
          "Task Name",
          "Project Name",
          "Assigned Employee",
          "Miscellaneous",
          "Status",
          "Task Fee",
          "Total Amount",
          "Task Due",
          "Task Completed",
          "Date Created",
        ]);

        statusTasks.forEach((t) => {
          csvData.push([
            t.task_name,
            projects[t.project_id] || `Project ${t.project_id}`,
            employees[t.employee] || `Employee ${t.employee}`,
            t.miscellaneous,
            t.status,
            t.task_fee,
            t.amount,
            t.due_date,
            t.actual_finish,
            t.created_at,
          ]);
        });

        csvData.push([]); // Blank row for spacing
      }
    });

    return csvData;
  };
  const formatTasksPerProjectCSV = () => {
    let csvData = [];

    // Group tasks by project
    const tasksByProject = {};
    tasks.forEach((task) => {
      const projectName =
        projects[task.project_id] || `Project ${task.project_id}`;
      if (!tasksByProject[projectName]) {
        tasksByProject[projectName] = [];
      }
      tasksByProject[projectName].push(task);
    });

    // Loop through projects and their tasks
    Object.keys(tasksByProject).forEach((projectName) => {
      csvData.push([projectName]); // Add project name as a row header

      csvData.push([
        "Task Name",
        "Assigned Employee",
        "Miscellaneous",
        "Status",
        "Task Fee",
        "Total Amount",
        "Task Due",
        "Task Completed",
        "Date Created",
      ]);

      tasksByProject[projectName].forEach((task) => {
        csvData.push([
          task.task_name,
          employees[task.employee] || `Employee ${task.employee}`,
          task.miscellaneous,
          task.status,
          task.task_fee,
          task.amount,
          task.due_date,
          task.actual_finish,
          task.created_at,
        ]);
      });

      csvData.push([]); // Blank row for spacing
    });

    return csvData;
  };
  const formatTaskDueCSV = () => {
    let csvData = [];

    // Group tasks by Year & Month
    const tasksByMonthYear = tasks.reduce((acc, task) => {
      const taskDate = new Date(task.due_date);
      const year = taskDate.getFullYear();
      const month = months[taskDate.getMonth() + 1]; // Get month name

      const key = `${month} ${year}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(task);
      return acc;
    }, {});

    // Loop through each Month-Year and format CSV
    Object.keys(tasksByMonthYear).forEach((monthYear) => {
      csvData.push([monthYear]); // Section header
      csvData.push([
        "Task Name",
        "Project Name",
        "Assigned Employee",
        "Miscellaneous",
        "Status",
        "Task Fee",
        "Total Amount",
        "Due Date",
        "Actual Finish",
        "Created At",
      ]); // Column headers

      tasksByMonthYear[monthYear].forEach((task) => {
        csvData.push([
          task.task_name,
          projects[task.project_id] || `Project ${task.project_id}`,
          employees[task.employee] || `Employee ${task.employee}`,
          task.miscellaneous || "N/A",
          task.status,
          task.task_fee || 0,
          task.amount || 0,
          task.due_date,
          task.actual_finish || "N/A",
          task.created_at,
        ]);
      });

      csvData.push([]); // Blank row for spacing
    });

    return csvData;
  };
  const formatTaskPaymentStatusCSV = () => {
    let csvData = [["Projects per Client"]]; // Title row

    clients.forEach((client) => {
      const clientProjects = projects.filter((p) => p.clientId === client.id);

      if (clientProjects.length > 0) {
        csvData.push([client.firstName + " " + client.lastName]); // Client name
        csvData.push([
          "Project Name",
          "Description",
          "Start Date",
          "End Date",
          "Created At",
        ]); // Column headers

        clientProjects.forEach((p) => {
          csvData.push([
            p.projectName,
            p.description,
            p.startDate,
            p.endDate,
            p.created_at,
          ]);
        });

        csvData.push([]); // Blank row for spacing
      }
    });

    return csvData;
  };

  let exportCSVData = [];

  if (selectedReport === "Task Status") {
    exportCSVData = formatTaskbyStatusCSV();
  } else if (selectedReport === "Tasks Per Project") {
    exportCSVData = formatTasksPerProjectCSV();
  } else if (selectedReport === "Task Due") {
    exportCSVData = formatTaskDueCSV();
  } else if (selectedReport === "Task Payment Status") {
    exportCSVData = formatTaskPaymentStatusCSV();
  } else {
    exportCSVData = projects;
  }

  const exportPDF = async () => {
    const doc = new jsPDF("landscape", "mm", "a4");
    doc.setFontSize(10);
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

    if (selectedReport === "Total Projects") {
      const headers = [
        [
          "Project Name",
          "Client Name",
          "Description",
          "Status",
          "Project Start",
          "Project End",
          "Actual Finish",
          "Date Created",
        ],
      ];
      const data = projects.map((p) => [
        p.projectName,
        p.clientName,
        p.description,
        p.status,
        p.startDate,
        p.endDate,
        p.actualFinish,
        p.created_at,
      ]);

      autoTable(doc, {
        startY: yPos,
        head: headers,
        body: data,
        styles: { fontSize: 8 },
      });
    }

    if (selectedReport === "Projects by Status") {
      const statuses = ["Pending", "Ongoing", "Completed"];

      statuses.forEach((status) => {
        const projectStatus = projects.filter((p) => p.status === status);

        if (projectStatus.length > 0) {
          doc.setFontSize(12);
          doc.text(status, 10, yPos);
          yPos += 10;

          const headers = [
            [
              "Project Name",
              "Client Name",
              "Description",
              "Status",
              "Project Start",
              "Project End",
              "Actual Finish",
              "Date Created",
            ],
          ];
          const data = projectStatus.map((p) => [
            p.projectName,
            p.clientName,
            p.description,
            p.status,
            p.startDate,
            p.endDate,
            p.actualFinish,
            p.created_at,
          ]);

          autoTable(doc, {
            startY: yPos,
            head: headers,
            body: data,
            styles: { fontSize: 8 },
          });
          yPos = doc.lastAutoTable.finalY + 10;
        }
      });
    }

    if (selectedReport === "Overdue Projects") {
      const headers = [
        [
          "Project Name",
          "Client Name",
          "Description",
          "Status",
          "End Date",
          "Days Overdue",
        ],
      ];
      const overdueProjects = projects
        .filter((p) => p.isDelayed === 1)
        .map((p) => [
          p.projectName,
          p.clientName,
          p.description,
          p.status,
          p.endDate,
          p.delayedDays, // Ensure this field exists in your backend response
        ]);

      autoTable(doc, {
        startY: yPos,
        head: headers,
        body: overdueProjects,
        styles: { fontSize: 8 },
      });
    }

    if (selectedReport === "Projects per Client") {
      clients.forEach((client) => {
        const clientProjects = projects.filter((p) => p.clientId === client.id);

        if (clientProjects.length > 0) {
          doc.setFontSize(12);
          doc.text(`${client.firstName} ${client.lastName}`, 10, yPos);
          yPos += 10;

          const headers = [
            [
              "Project Name",
              "Description",
              "Start Date",
              "End Date",
              "Created At",
            ],
          ];
          const data = clientProjects.map((p) => [
            p.projectName,
            p.description,
            p.startDate,
            p.endDate,
            p.created_at,
          ]);

          autoTable(doc, {
            startY: yPos,
            head: headers,
            body: data,
            styles: { fontSize: 8 },
          });
          yPos = doc.lastAutoTable.finalY + 10;
        }
      });
    }

    doc.save(`${selectedReport.replace(/\s+/g, "_").toLowerCase()}.pdf`);
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
          <option value="Task Payment Status">Task Payment Status</option>
        </select>

        {selectedReport && (
          <>
            <CSVLink
              data={exportCSVData}
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
