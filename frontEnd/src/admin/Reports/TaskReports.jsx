import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import landscapeTemplate from "../../assets/reports_landscape.jpg";
import AppointmentTemplate from "../../assets/reports_portrait.jpg";
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
  const [exportProjectSelection, setExportProjectSelection] = useState("All");

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

  const totalTasks = tasks.length;

  const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed
  const tasksThisMonth = tasks.filter((task) => {
    const taskDate = new Date(task.due_date);
    return (
      taskDate.getMonth() + 1 === currentMonth &&
      taskDate.getFullYear() === new Date().getFullYear()
    );
  }).length;

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

  const formatTotalTasksCSV = () => {
    return [
      ["Report Type", "Count"],
      ["Total Tasks", totalTasks],
      [],
      ["Detailed Task Information"],
      [
        "Task Name",
        "Project Name",
        "Assigned Employee",
        "Status",
        "Due Date",
        "Amount",
      ],
      ...tasks.map((task) => [
        task.task_name,
        projects[task.project_id] || `Project ${task.project_id}`,
        employees[task.employee] || `Employee ${task.employee}`,
        task.status,
        task.due_date,
        task.amount,
      ]),
    ];
  };
  const formatTasksThisMonthCSV = () => {
    const currentMonthTasks = tasks.filter((task) => {
      const taskDate = new Date(task.due_date);
      return (
        taskDate.getMonth() + 1 === currentMonth &&
        taskDate.getFullYear() === new Date().getFullYear()
      );
    });

    return [
      ["Report Type", "Count"],
      ["Tasks This Month", tasksThisMonth],
      [], // empty row for spacing
      ["Tasks Due This Month"],
      [
        "Task Name",
        "Project Name",
        "Assigned Employee",
        "Status",
        "Due Date",
        "Amount",
      ],
      ...currentMonthTasks.map((task) => [
        task.task_name,
        projects[task.project_id] || `Project ${task.project_id}`,
        employees[task.employee] || `Employee ${task.employee}`,
        task.status,
        task.due_date,
        task.amount,
      ]),
    ];
  };
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

    // If a specific project is selected for export, filter to only that project
    const projectsToExport =
      exportProjectSelection === "All"
        ? Object.keys(tasksByProject)
        : [exportProjectSelection];

    // Loop through selected projects and their tasks
    projectsToExport.forEach((projectName) => {
      const projectTasks = tasksByProject[projectName];
      if (!projectTasks) return; // Skip if no tasks for this project

      csvData.push([projectName]); // Add project name as a row header

      csvData.push([
        "Task Name",
        "Assigned Employee",
        "Task Fee",
        "Status",
        "Total Amount",
        "Task Due",
        "Task Completed",
        "Date Created",
      ]);

      projectTasks.forEach((task) => {
        csvData.push([
          task.task_name,
          employees[task.employee] || `Employee ${task.employee}`,
          task.task_fee,
          task.status,
          task.amount,
          task.due_date,
          task.date_paid || "Not Paid",
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
    let csvData = [];

    // Group tasks into Paid and Not Paid
    const notPaidTasks = tasks.filter((task) => task.status !== "Completed");
    const paidTasks = tasks.filter((task) => task.status === "Completed");

    if (notPaidTasks.length > 0) {
      csvData.push(["Not Paid"]); // Section title
      csvData.push([
        "task_name",
        "projectName",
        "miscellaneous",
        "task_fee",
        "amount",
        "due_date",
      ]); // Headers

      notPaidTasks.forEach((task) => {
        csvData.push([
          task.task_name,
          projects[task.project_id] || `Project ${task.project_id}`,
          task.miscellaneous || "N/A",
          task.task_fee || 0,
          task.amount || 0,
          task.due_date,
        ]);
      });

      csvData.push([]); // Blank row for spacing
    }

    if (paidTasks.length > 0) {
      csvData.push(["Paid"]); // Section title
      csvData.push([
        "task_name",
        "projectName",
        "miscellaneous",
        "task_fee",
        "amount",
        "due_date",
      ]); // Headers

      paidTasks.forEach((task) => {
        csvData.push([
          task.task_name,
          projects[task.project_id] || `Project ${task.project_id}`,
          task.miscellaneous || "N/A",
          task.task_fee || 0,
          task.amount || 0,
          task.due_date,
        ]);
      });

      csvData.push([]); // Blank row for spacing
    }

    return csvData;
  };

  let exportCSVData = [];

  if (selectedReport === "Total Tasks") {
    exportCSVData = formatTotalTasksCSV();
  } else if (selectedReport === "Tasks This Month") {
    exportCSVData = formatTasksThisMonthCSV();
  } else if (selectedReport === "Task Status") {
    exportCSVData = formatTaskbyStatusCSV();
  } else if (selectedReport === "Tasks Per Project") {
    exportCSVData = formatTasksPerProjectCSV();
  } else if (selectedReport === "Task Due") {
    exportCSVData = formatTaskDueCSV();
  } else if (selectedReport === "Task Payment") {
    exportCSVData = formatTaskPaymentStatusCSV();
  } else {
    exportCSVData = projects;
  }

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
    const isLandscape = ["Total Tasks", "Tasks This Month"].includes(
      selectedReport
    );
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

    if (selectedReport === "Total Tasks") {
      const headers = [
        ["Task Name", "Project", "Assigned To", "Status", "Due Date", "Amount"],
      ];
      const data = tasks.map((task) => [
        task.task_name,
        projects[task.project_id] || `Project ${task.project_id}`,
        employees[task.employee] || `Employee ${task.employee}`,
        task.status,
        new Date(task.due_date).toLocaleDateString(),
        `${task.amount.toFixed(2) || 0.0}`,
      ]);
      doc
        .setFontSize(20)
        .setFont("helvetica", "bold")
        .setTextColor(40)
        .text("Tasks Overview", 145, startY + 3, { align: "center" });

      autoTable(doc, {
        startY: startY + 13,
        head: headers,
        body: data,
        styles: { fontSize: 8, textColor: [0, 0, 0] },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        showHead: "everyPage",
      });
    }
    if (selectedReport === "Tasks This Month") {
      const currentMonthTasks = tasks.filter((task) => {
        const taskDate = new Date(task.due_date);
        return (
          taskDate.getMonth() + 1 === currentMonth &&
          taskDate.getFullYear() === new Date().getFullYear()
        );
      });
      const headers = [
        ["Task Name", "Project", "Assigned To", "Status", "Due Date", "Amount"],
      ];

      const data = currentMonthTasks.map((task) => [
        task.task_name,
        projects[task.project_id] || `Project ${task.project_id}`,
        employees[task.employee] || `Employee ${task.employee}`,
        task.status,
        new Date(task.due_date).toLocaleDateString(),
        `${task.amount.toFixed(2) || 0.0}`,
      ]);
      doc
        .setFontSize(20)
        .setFont("helvetica", "bold")
        .setTextColor(40)
        .text("Tasks this Month", 145, startY + 3, { align: "center" });

      autoTable(doc, {
        startY: startY + 13,
        head: headers,
        body: data,
        styles: { fontSize: 6, textColor: [0, 0, 0] },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        showHead: "everyPage",
      });
    }
    if (selectedReport === "Task Status") {
      // First page - Chart
      try {
        // Capture the chart element
        const chartElement = document.querySelector(
          "#task-status .recharts-wrapper"
        );
        if (chartElement) {
          const canvas = await html2canvas(chartElement, {
            scale: 3,
            logging: true,
            useCORS: true,
          });
          const imgData = canvas.toDataURL("image/png");
          const imgWidth = 140;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Add chart to first page
          doc
            .setFontSize(16)
            .setFont("helvetica", "bold")
            .setTextColor(40)
            .text("Tasks by Status Overview", 105, 45, { align: "center" });

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
              "Displays the distribution of tasks based on their current status: Pending, Ongoing, or Completed.",
              105,
              50 + imgHeight + 10,
              { align: "center" }
            );
        }
      } catch (error) {
        console.error("Error capturing chart:", error);
      }

      // Add new page for status details
      doc.addPage();
      setupPage(doc);

      const statuses = ["Ongoing", "Completed"];
      let hasData = false;

      statuses.forEach((status, index) => {
        const taskStatus = tasks.filter((t) => t.status === status);

        if (taskStatus.length > 0) {
          // Add new page for each status (except first one after chart)
          if (index > 0) {
            doc.addPage();
            setupPage(doc);
          }

          // Reset Y position for new page
          let startY = 40;

          // Add status title
          doc
            .setFontSize(16)
            .setFont("helvetica", "bold")
            .setTextColor(40)
            .text(`${status} Tasks`, 105, startY, { align: "center" });

          startY += 15;

          // Add table
          const headers = [
            [
              "Task Name",
              "Project Name",
              "Assigned Employee",
              "Status",
              "Task Fee",
              "Total Amount",
              "Task Due",
              "Task Completed",
              "Date Created",
            ],
          ];

          const data = taskStatus.map((t) => [
            t.task_name,
            projects[t.project_id] || `Project ${t.project_id}`,
            employees[t.employee] || `Employee ${t.employee}`,
            t.status,
            `${t.task_fee.toFixed(2) || 0.0}`,
            `${t.amount.toFixed(2) || 0.0}`,
            t.due_date,
            formatDate(t.date_paid),
            formatDate(t.created_at),
          ]);

          autoTable(doc, {
            startY: startY,
            head: headers,
            body: data,
            styles: { fontSize: 6, textColor: [0, 0, 0] },
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
            showHead: "everyPage",
          });

          // Add status summary
          startY = doc.lastAutoTable.finalY + 10;
          doc
            .setFontSize(10)
            .setTextColor(40)
            .text(`Total ${status} Tasks: ${taskStatus.length}`, 14, startY);

          // Add footer to this page
          addFooter(doc);
        }
      });
    }
    if (selectedReport === "Tasks Per Project") {
      try {
        // Capture the chart element
        const chartElement = document.querySelector(
          "#tasks-per-project .recharts-wrapper"
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
            .text("Tasks Per Project Overview", 105, 45, { align: "center" }); // Updated title

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
              "Illustrates the number of tasks assigned to each project.",
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

      const tasksByProject = {};
      let grandTotal = 0; // Initialize grand total counter

      // Group tasks by project
      tasks.forEach((task) => {
        const projectName =
          projects[task.project_id] || `Project ${task.project_id}`;
        if (!tasksByProject[projectName]) {
          tasksByProject[projectName] = [];
        }
        tasksByProject[projectName].push(task);
      });

      const projectsToExport =
        exportProjectSelection === "All"
          ? Object.keys(tasksByProject)
          : [exportProjectSelection];

      projectsToExport.forEach((projectName, index) => {
        const projectTasks = tasksByProject[projectName];
        if (!projectTasks || projectTasks.length === 0) return;

        // Add new page for each project (except first one after chart)
        if (index > 0) {
          doc.addPage();
          setupPage(doc);
        }

        let startY = 45;

        // Project header
        doc
          .setFontSize(12)
          .setFont("helvetica", "bolditalic")
          .setTextColor(40)
          .text(`Project: ${projectName}`, 105, startY, { align: "center" });

        startY += 10;

        // Tasks table
        const headers = [
          [
            "Task Name",
            "Assigned Employee",
            "Status",
            "Task Fee",
            "Total Amount",
            "Due Date",
            "Date Completed",
            "Date Created",
          ],
        ];

        const formatCurrency = (amount) => {
          return amount ? `${parseFloat(amount).toFixed(2)}` : "0.00";
        };

        const formatDate = (dateString) => {
          return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
        };

        const data = projectTasks.map((t) => [
          t.task_name || "N/A",
          employees[t.employee] || `Employee ${t.employee}`,
          t.status || "N/A",
          formatCurrency(t.task_fee),
          formatCurrency(t.amount),
          formatDate(t.due_date),
          t.date_paid ? formatDate(t.date_paid) : "Not Paid",
          formatDate(t.created_at),
        ]);

        autoTable(doc, {
          startY: startY,
          head: headers,
          body: data,
          styles: { fontSize: 6, textColor: [0, 0, 0] },
          headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
          showHead: "everyPage",
        });

        // Project summary
        const projectTotal = projectTasks.length;
        grandTotal += projectTotal;

        startY = doc.lastAutoTable.finalY + 10;
        doc
          .setFontSize(10)
          .setFont("helvetica", "italic")
          .text(`Total Tasks for ${projectName}: ${projectTotal}`, 14, startY);
      });

      // Add summary page if multiple projects
      if (projectsToExport.length > 1 && grandTotal > 0) {
        doc.addPage();
        setupPage(doc);

        doc
          .setFontSize(16)
          .setFont("helvetica", "bold")
          .setTextColor(40)
          .text("Tasks Summary by Project", 105, 40, { align: "center" }); // Updated title

        const summaryHeaders = [["Project Name", "Number of Tasks"]];
        const summaryData = projectsToExport.map((projectName) => {
          const count = tasksByProject[projectName]?.length || 0;
          return [projectName, count];
        });

        autoTable(doc, {
          startY: 45,
          head: summaryHeaders,
          body: summaryData,
          styles: { fontSize: 8 }, // Increased font size for better readability
          headStyles: {
            fillColor: [220, 220, 220],
            textColor: [0, 0, 0],
            fontStyle: "bold",
          },
        });

        doc
          .setFontSize(10)
          .setFont("helvetica", "bolditalic")
          .text(
            `Overall Total: ${grandTotal} tasks`,
            14,
            doc.lastAutoTable.finalY + 15
          );
      }
    }
    if (selectedReport === "Task Due") {
      let chartExists = false; // Flag to track if chart was captured

      try {
        // Capture the chart element
        const chartElement = document.querySelector(
          "#tasks-due .recharts-wrapper"
        );
        if (chartElement) {
          chartExists = true;
          const canvas = await html2canvas(chartElement, {
            scale: 3,
            logging: true,
            useCORS: true,
          });
          const imgData = canvas.toDataURL("image/png");
          const imgWidth = 160;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Add chart to first page
          doc
            .setFontSize(16)
            .setFont("helvetica", "bold")
            .setTextColor(40)
            .text("Tasks Due Overview", 105, 45, { align: "center" });

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
              "Shows the upcoming due dates of tasks, helping in tracking deadlines.",
              105,
              50 + imgHeight + 10,
              { align: "center" }
            );
        }
      } catch (error) {
        console.error("Error capturing chart:", error);
      }

      // Group tasks by month and year
      const tasksByMonthYear = tasks.reduce((acc, task) => {
        const taskDate = new Date(task.due_date);
        const year = taskDate.getFullYear();
        const month = months[taskDate.getMonth() + 1];
        const key = `${month} ${year}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(task);
        return acc;
      }, {});

      // Process each month-year group
      Object.keys(tasksByMonthYear).forEach((monthYear, index) => {
        // Add new page for each month-year group (except first one if no chart exists)
        if (index > 0 || chartExists) {
          doc.addPage();
          setupPage(doc);
        }

        let startY = 40;

        // Month-Year header
        doc
          .setFontSize(12)
          .setFont("helvetica", "bold")
          .setTextColor(40)
          .text(`Tasks Due for ${monthYear}`, 105, startY, { align: "center" });

        startY += 15;

        // Tasks table
        const headers = [
          [
            "Task Name",
            "Project",
            "Assigned To",
            "Status",
            "Task Fee",
            "Total Amount",
            "Due Date",
            "Completed",
          ],
        ];

        const formatCurrency = (amount) => {
          return amount ? `${parseFloat(amount).toFixed(2)}` : "₱0.00";
        };

        const formatDate = (dateString) => {
          return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
        };

        const data = tasksByMonthYear[monthYear].map((t) => [
          t.task_name || "N/A",
          projects[t.project_id] || `Project ${t.project_id}`,
          employees[t.employee] || `Employee ${t.employee}`,
          t.status || "N/A",
          formatCurrency(t.task_fee),
          formatCurrency(t.amount),
          formatDate(t.due_date),
          t.actual_finish ? formatDate(t.actual_finish) : "Pending",
        ]);

        autoTable(doc, {
          startY: startY,
          head: headers,
          body: data,
          styles: {
            fontSize: 8,
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

        // Add summary for the month
        const taskCount = tasksByMonthYear[monthYear].length;
        startY = doc.lastAutoTable.finalY + 10;
        doc
          .setFontSize(10)
          .setFont("helvetica", "italic")
          .text(`Total Tasks Due in ${monthYear}: ${taskCount}`, 14, startY);
      });
    }
    if (selectedReport === "Task Payment") {
      let chartExists = false;

      try {
        // Capture the chart element
        const chartElement = document.querySelector(
          "#task-payment .recharts-wrapper"
        );
        if (chartElement) {
          chartExists = true;
          const canvas = await html2canvas(chartElement, {
            scale: 3,
            logging: true,
            useCORS: true,
          });
          const imgData = canvas.toDataURL("image/png");
          const imgWidth = 190;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Add chart to first page
          doc
            .setFontSize(16)
            .setFont("helvetica", "bold")
            .setTextColor(40)
            .text("Tasks Payment Overview", 105, 45, { align: "center" });

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
              "Displays the total payments associated with each task.",
              105,
              50 + imgHeight + 10,
              { align: "center" }
            );
        }
      } catch (error) {
        console.error("Error capturing chart:", error);
      }

      // Filter tasks
      const notPaidTasks = tasks.filter((t) => t.status !== "Completed");
      const paidTasks = tasks.filter((t) => t.status === "Completed");

      const formatCurrency = (amount) =>
        amount ? `${parseFloat(amount).toFixed(2)}` : "₱0.00";
      const formatDate = (dateString) =>
        dateString ? new Date(dateString).toLocaleDateString() : "N/A";

      const formatTasks = (taskList) =>
        taskList.map((t) => [
          t.task_name || "N/A",
          projects[t.project_id] || `Project ${t.project_id}`,
          formatCurrency(t.task_fee),
          formatCurrency(t.amount),
          formatDate(t.due_date),
          t.date_paid ? formatDate(t.date_paid) : "Not Paid",
        ]);

      const headers = [
        ["Task Name", "Project", "Task Fee", "Amount", "Due Date", "Date Paid"],
      ];

      // Process Not Paid Tasks
      if (notPaidTasks.length > 0) {
        if (chartExists) {
          doc.addPage();
        }
        setupPage(doc);

        let startY = 40;
        doc
          .setFontSize(16)
          .setFont("helvetica", "bold")
          .setTextColor(40)
          .text("Unpaid Tasks", 105, startY, { align: "center" });

        startY += 20;

        autoTable(doc, {
          startY: startY,
          head: headers,
          body: formatTasks(notPaidTasks),
          styles: {
            fontSize: 8,
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
      }

      // Process Paid Tasks
      if (paidTasks.length > 0) {
        doc.addPage();
        setupPage(doc);

        let startY = 40;
        doc
          .setFontSize(16)
          .setFont("helvetica", "bold")
          .setTextColor(40)
          .text("Paid Tasks", 105, startY, { align: "center" });

        startY += 20;

        autoTable(doc, {
          startY: startY,
          head: headers,
          body: formatTasks(paidTasks),
          styles: {
            fontSize: 8,
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
      }

      // Handle case when no tasks found
      if (notPaidTasks.length === 0 && paidTasks.length === 0) {
        if (chartExists) {
          doc.addPage();
        }
        setupPage(doc);
        doc
          .setFontSize(12)
          .text("No tasks found for Task Payment report.", 14, 40);
      }
    }

    for (let i = 1; i <= doc.internal.getNumberOfPages(); i++) {
      doc.setPage(i);
      addFooter(doc);
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
          <option value="Total Tasks">Total Tasks</option>
          <option value="Tasks This Month">Tasks This Month</option>
          <option value="Task Status">Task Status</option>
          <option value="Tasks Per Project">Tasks Per Project</option>
          <option value="Task Due">Task Due</option>
          <option value="Task Payment">Task Payment</option>
        </select>

        {selectedReport === "Tasks Per Project" && (
          <select
            className="bg-gray-200 text-black px-4 py-2 rounded"
            value={exportProjectSelection}
            onChange={(e) => setExportProjectSelection(e.target.value)}
          >
            <option value="All">All Projects</option>
            {Object.entries(projects).map(([id, name]) => (
              <option key={id} value={name}>
                {name}
              </option>
            ))}
          </select>
        )}

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
      <div className="summary-container flex justify-between mb-6 p-4 bg-gray-100 rounded-lg">
        <div className="summary-box bg-white p-6 rounded-lg shadow-md text-center w-1/2 mr-4">
          <h3 className="summary-title text-lg font-semibold text-gray-700">
            Total Tasks
          </h3>
          <p className="summary-value text-3xl font-bold text-blue-600 mt-2">
            {totalTasks}
          </p>
        </div>
        <div className="summary-box bg-white p-6 rounded-lg shadow-md text-center w-1/2">
          <h3 className="summary-title text-lg font-semibold text-gray-700">
            Tasks This Month
          </h3>
          <p className="summary-value text-3xl font-bold text-green-600 mt-2">
            {tasksThisMonth}
          </p>
        </div>
      </div>
      <div className="tasks-grid-container">
        <div
          className="tasks-graph-container scrollable-chart"
          id="task-status"
        >
          <h3>Task Status</h3>
          <p>
            Displays the distribution of tasks based on their current status:
            Pending, Ongoing, or Completed.
          </p>
          <PieChart width={600} height={400}>
            <Pie
              data={filteredTaskStatusCounts}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={180}
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

        <div
          className="tasks-graph-container scrollable-chart"
          id="tasks-per-project"
        >
          <h3>Tasks Per Project</h3>
          <p>Illustrates the number of tasks assigned to each project.</p>
          <select
            className="mb-4 p-2 border rounded"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>

          <BarChart width={1600} height={320} data={projectTaskData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-15} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" name="Task Count" />
          </BarChart>
        </div>

        <div className="tasks-graph-container scrollable-chart" id="tasks-due">
          <h3>Task Due Dates</h3>
          <p>
            Shows the upcoming due dates of tasks, helping in tracking
            deadlines.
          </p>
          <LineChart width={1000} height={450} data={filteredTaskDueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="task_name" angle={-10} />
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

        <div
          className="tasks-graph-container scrollable-chart"
          id="task-payment"
        >
          <div className="mb-4">
            <h3>Task Payment</h3>
            <p>Displays the total payments associated with each task.</p>
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

          <BarChart width={1100} height={400} data={taskPaymentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-10} />
            <YAxis />
            <Tooltip formatter={(value) => [`Amount: P${value}`]} />
            <Legend />
            <Bar dataKey="amount" fill="#FF0000" name="Amount" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default TaskReports;
